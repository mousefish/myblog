/* tslint:disable */
/* eslint-disable */
/**
 */
export function hello_world(): void
/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function add(a: number, b: number): number
/**
 */
export enum MoveDirection {
  UP = 0,
  Down = 1,
  LEFT = 2,
  RIGHT = 3,
}
/**
 */
export enum GameState {
  WIN = 0,
  LOSS = 1,
  PLAY = 2,
}
/**
 */
export class Scene {
  free(): void
  /**
   * @param {number} width
   * @param {number} snake_head
   * @returns {Scene}
   */
  static new(width: number, snake_head: number): Scene
  /**
   * @param {MoveDirection} direction
   */
  change_direction(direction: MoveDirection): void
  /**
   * @returns {number}
   */
  snake_head(): number
  /**
   * @returns {number}
   */
  snake_length(): number
  /**
   * @returns {Uint32Array}
   */
  snake_body(): Uint32Array
  /**
   * @returns {number}
   */
  get_reward(): number
  /**
   * @returns {number}
   */
  get_point(): number
  /**
   * @returns {GameState | undefined}
   */
  get_game_status(): GameState | undefined
  /**
   * @param {number} snake_head
   */
  reset(snake_head: number): void
  /**
   * @param {boolean} space_pressed
   */
  update(space_pressed: boolean): void
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_scene_free: (a: number) => void
  readonly scene_new: (a: number, b: number) => number
  readonly scene_change_direction: (a: number, b: number) => void
  readonly scene_snake_head: (a: number) => number
  readonly scene_snake_length: (a: number) => number
  readonly scene_snake_body: (a: number, b: number) => void
  readonly scene_get_reward: (a: number) => number
  readonly scene_get_point: (a: number) => number
  readonly scene_get_game_status: (a: number) => number
  readonly scene_reset: (a: number, b: number) => void
  readonly scene_update: (a: number, b: number) => void
  readonly hello_world: () => void
  readonly add: (a: number, b: number) => number
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number
  readonly __wbindgen_free: (a: number, b: number, c: number) => void
}

export type SyncInitInput = BufferSource | WebAssembly.Module
/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {SyncInitInput} module
 *
 * @returns {InitOutput}
 */
export function initSync(module: SyncInitInput): InitOutput

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {InitInput | Promise<InitInput>} module_or_path
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?: InitInput | Promise<InitInput>
): Promise<InitOutput>
