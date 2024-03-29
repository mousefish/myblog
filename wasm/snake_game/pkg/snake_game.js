let wasm

const cachedTextDecoder =
  typeof TextDecoder !== 'undefined'
    ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true })
    : {
        decode: () => {
          throw Error('TextDecoder not available')
        },
      }

if (typeof TextDecoder !== 'undefined') {
  cachedTextDecoder.decode()
}

let cachedUint8Memory0 = null

function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer)
  }
  return cachedUint8Memory0
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len))
}

const heap = new Array(128).fill(undefined)

heap.push(undefined, null, true, false)

let heap_next = heap.length

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1)
  const idx = heap_next
  heap_next = heap[idx]

  heap[idx] = obj
  return idx
}

function getObject(idx) {
  return heap[idx]
}

function dropObject(idx) {
  if (idx < 132) return
  heap[idx] = heap_next
  heap_next = idx
}

function takeObject(idx) {
  const ret = getObject(idx)
  dropObject(idx)
  return ret
}

let cachedInt32Memory0 = null

function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer)
  }
  return cachedInt32Memory0
}

let cachedUint32Memory0 = null

function getUint32Memory0() {
  if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
    cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer)
  }
  return cachedUint32Memory0
}

function getArrayU32FromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len)
}
/**
 */
export function hello_world() {
  wasm.hello_world()
}

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function add(a, b) {
  const ret = wasm.add(a, b)
  return ret >>> 0
}

function notDefined(what) {
  return () => {
    throw new Error(`${what} is not defined`)
  }
}
/**
 */
export const MoveDirection = Object.freeze({
  UP: 0,
  0: 'UP',
  Down: 1,
  1: 'Down',
  LEFT: 2,
  2: 'LEFT',
  RIGHT: 3,
  3: 'RIGHT',
})
/**
 */
export const GameState = Object.freeze({ WIN: 0, 0: 'WIN', LOSS: 1, 1: 'LOSS', PLAY: 2, 2: 'PLAY' })

const SceneFinalization =
  typeof FinalizationRegistry === 'undefined'
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry((ptr) => wasm.__wbg_scene_free(ptr >>> 0))
/**
 */
export class Scene {
  static __wrap(ptr) {
    ptr = ptr >>> 0
    const obj = Object.create(Scene.prototype)
    obj.__wbg_ptr = ptr
    SceneFinalization.register(obj, obj.__wbg_ptr, obj)
    return obj
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0
    SceneFinalization.unregister(this)
    return ptr
  }

  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_scene_free(ptr)
  }
  /**
   * @param {number} width
   * @param {number} snake_head
   * @returns {Scene}
   */
  static new(width, snake_head) {
    const ret = wasm.scene_new(width, snake_head)
    return Scene.__wrap(ret)
  }
  /**
   * @param {MoveDirection} direction
   */
  change_direction(direction) {
    wasm.scene_change_direction(this.__wbg_ptr, direction)
  }
  /**
   * @returns {number}
   */
  snake_head() {
    const ret = wasm.scene_snake_head(this.__wbg_ptr)
    return ret >>> 0
  }
  /**
   * @returns {number}
   */
  snake_length() {
    const ret = wasm.scene_snake_length(this.__wbg_ptr)
    return ret >>> 0
  }
  /**
   * @returns {Uint32Array}
   */
  snake_body() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.scene_snake_body(retptr, this.__wbg_ptr)
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      var v1 = getArrayU32FromWasm0(r0, r1).slice()
      wasm.__wbindgen_free(r0, r1 * 4, 4)
      return v1
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * @returns {number}
   */
  get_reward() {
    const ret = wasm.scene_get_reward(this.__wbg_ptr)
    return ret >>> 0
  }
  /**
   * @returns {number}
   */
  get_point() {
    const ret = wasm.scene_get_point(this.__wbg_ptr)
    return ret >>> 0
  }
  /**
   * @returns {GameState | undefined}
   */
  get_game_status() {
    const ret = wasm.scene_get_game_status(this.__wbg_ptr)
    return ret === 3 ? undefined : ret
  }
  /**
   * @param {number} snake_head
   */
  reset(snake_head) {
    wasm.scene_reset(this.__wbg_ptr, snake_head)
  }
  /**
   * @param {boolean} space_pressed
   */
  update(space_pressed) {
    wasm.scene_update(this.__wbg_ptr, space_pressed)
  }
}

async function __wbg_load(module, imports) {
  if (typeof Response === 'function' && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === 'function') {
      try {
        return await WebAssembly.instantiateStreaming(module, imports)
      } catch (e) {
        if (module.headers.get('Content-Type') != 'application/wasm') {
          console.warn(
            '`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n',
            e
          )
        } else {
          throw e
        }
      }
    }

    const bytes = await module.arrayBuffer()
    return await WebAssembly.instantiate(bytes, imports)
  } else {
    const instance = await WebAssembly.instantiate(module, imports)

    if (instance instanceof WebAssembly.Instance) {
      return { instance, module }
    } else {
      return instance
    }
  }
}

function __wbg_get_imports() {
  const imports = {}
  imports.wbg = {}
  imports.wbg.__wbindgen_string_new = function (arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1)
    return addHeapObject(ret)
  }
  imports.wbg.__wbindgen_object_drop_ref = function (arg0) {
    takeObject(arg0)
  }
  imports.wbg.__wbg_debug_7d82cf3cd21e00b0 = function (arg0) {
    console.debug(getObject(arg0))
  }
  imports.wbg.__wbg_error_b834525fe62708f5 = function (arg0) {
    console.error(getObject(arg0))
  }
  imports.wbg.__wbg_info_12174227444ccc71 = function (arg0) {
    console.info(getObject(arg0))
  }
  imports.wbg.__wbg_log_79d3c56888567995 = function (arg0) {
    console.log(getObject(arg0))
  }
  imports.wbg.__wbg_warn_2a68e3ab54e55f28 = function (arg0) {
    console.warn(getObject(arg0))
  }
  imports.wbg.__wbg_random_1385edd75e02760c =
    typeof Math.random == 'function' ? Math.random : notDefined('Math.random')
  imports.wbg.__wbindgen_throw = function (arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1))
  }

  return imports
}

function __wbg_init_memory(imports, maybe_memory) {}

function __wbg_finalize_init(instance, module) {
  wasm = instance.exports
  __wbg_init.__wbindgen_wasm_module = module
  cachedInt32Memory0 = null
  cachedUint32Memory0 = null
  cachedUint8Memory0 = null

  return wasm
}

function initSync(module) {
  if (wasm !== undefined) return wasm

  const imports = __wbg_get_imports()

  __wbg_init_memory(imports)

  if (!(module instanceof WebAssembly.Module)) {
    module = new WebAssembly.Module(module)
  }

  const instance = new WebAssembly.Instance(module, imports)

  return __wbg_finalize_init(instance, module)
}

async function __wbg_init(input) {
  if (wasm !== undefined) return wasm

  if (typeof input === 'undefined') {
    input = new URL('snake_game_bg.wasm', import.meta.url)
  }
  const imports = __wbg_get_imports()

  if (
    typeof input === 'string' ||
    (typeof Request === 'function' && input instanceof Request) ||
    (typeof URL === 'function' && input instanceof URL)
  ) {
    input = fetch(input)
  }

  __wbg_init_memory(imports)

  const { instance, module } = await __wbg_load(await input, imports)

  return __wbg_finalize_init(instance, module)
}

export { initSync }
export default __wbg_init
