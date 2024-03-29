import * as Comlink from "./comlink";

const wasmImport = import("./crate/pkg");

const wasmModule = {
  async initialize() {
    const wasm = await wasmImport;
    Object.assign(wasmModule, wasm);
  }
};

Comlink.expose(wasmModule, self);
