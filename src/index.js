import * as Comlink from "./comlink";

/** @typedef {typeof import('./crate/pkg') & typeof import('./worker').wasmModule} WorkerModuleType */
/** @type {Comlink.ProxyResult<WorkerModuleType>} */
const wasm = Comlink.proxy(new Worker("./worker.js", { type: "module" }));

const $input = document.querySelector(".js-input");
const $list = document.querySelector(".js-list");
const $template = document.querySelector(".js-list-item-template");

$input.addEventListener("change", loadZip);

async function readZip(file) {
  const ab = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsArrayBuffer(file);
  });
  return new Uint8Array(ab);
}

async function loadZip(ev) {
  await wasm.initialize();

  const file = ev.target.files[0];
  if (!file) {
    return false;
  }
  ev.target.toggleAttribute("disabled", true);

  const buffer = await readZip(file);
  const zipReader = await new wasm.ZipReader(buffer);
  const filenameList = await zipReader.getFilenameList();

  for (const filename of filenameList) {
    const $item = document.importNode($template.content, true);
    const $filename = $item.querySelector(".js-filename");

    $filename.textContent = filename;
    $list.appendChild($item);
  }
}
