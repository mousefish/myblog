import { useEffect, useState, useRef } from 'react'
import init, { Scene, MoveDirection, GameState } from 'snake_game'

const CELL_SIZE = 20
const WORLD_WIDTH = 20
const SNAKE_INDEX = Date.now() % (WORLD_WIDTH * WORLD_WIDTH)
let space = false

const SnakeGame: () => JSX.Element = () => {
  const wasExecutedRef = useRef(false)
  let stop = false
  let timeout = null
  const [sceneReady, setSceneReady] = useState(false)
  const [context, setContext] = useState<CanvasRenderingContext2D>()
  const [point, setPoint] = useState(0)
  const [scene, setScene] = useState<Scene>()
  const [stateText, setstateText] = useState<string>()
  const [startButton, setStartButton] = useState<boolean>()

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath()
    // for (let x = 0; x < WORLD_WIDTH + 1; x++) {
    //     ctx.moveTo(CELL_SIZE * x, 0);
    //     ctx.lineTo(CELL_SIZE * x, WORLD_WIDTH * CELL_SIZE)
    // }

    // for (let y = 0; y < WORLD_WIDTH + 1; y++) {
    //     ctx.moveTo(0, CELL_SIZE * y);
    //     ctx.lineTo(WORLD_WIDTH * CELL_SIZE, CELL_SIZE * y);
    // }

    ctx.moveTo(0, 0)
    ctx.lineTo(0, WORLD_WIDTH * CELL_SIZE)
    ctx.lineTo(WORLD_WIDTH * CELL_SIZE - 1, CELL_SIZE * WORLD_WIDTH)
    ctx.lineTo(WORLD_WIDTH * CELL_SIZE - 1, 0)
    ctx.lineTo(0, 0)

    ctx.stroke()
  }

  const drawSnake = (ctx: CanvasRenderingContext2D, snake) => {
    snake
      .slice()
      .reverse()
      .forEach((snakeIndex) => {
        const col = snakeIndex % WORLD_WIDTH
        const row = Math.floor(snakeIndex / WORLD_WIDTH)
        ctx.beginPath()
        ctx.fillStyle = '#000000'
        ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
        ctx.stroke()
      })
  }

  const drawReward = (ctx: CanvasRenderingContext2D, rewardIndex) => {
    const col = rewardIndex % WORLD_WIDTH
    const row = Math.floor(rewardIndex / WORLD_WIDTH)
    ctx.beginPath()
    ctx.fillStyle = '#FF0000'
    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    ctx.stroke()
  }

  const animate = () => {
    const game_state = scene.get_game_status()
    if (game_state == GameState.WIN) {
      setstateText('You Win')
      stop = true
    }
    if (game_state == GameState.LOSS) {
      setstateText('You Loss')
      stop = true
    }
    if (stop) {
      setStartButton(true)
      return
    }
    let fps = 5
    if (space) {
      fps = 10
    }
    timeout = setTimeout(() => {
      if (!canvasRef.current) {
        return
      }
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      drawGrid(context)
      if (scene != null) {
        scene?.update(space)
        drawSnake(context, scene?.snake_body())
        drawReward(context, scene?.get_reward())
        setPoint(scene?.get_point())
      }
      requestAnimationFrame(animate)
    }, 1000 / fps)
  }

  const play = () => {
    stop = true
    clearTimeout(timeout)
    setstateText('')
    if (scene != null) {
      stop = false
      setStartButton(false)
      const snake_index = Date.now() % (WORLD_WIDTH * WORLD_WIDTH)
      scene.reset(snake_index)
      requestAnimationFrame(animate)
    }
  }

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    stop = false
    let scene1
    if (!wasExecutedRef.current) {
      ;(async () => {
        await init()
        scene1 = Scene.new(WORLD_WIDTH, SNAKE_INDEX)
        setScene(scene1)
        setSceneReady(true)
        drawGrid(ctx)
      })()
      const ctx = canvasRef.current.getContext('2d')
      canvasRef.current.height = CELL_SIZE * WORLD_WIDTH
      canvasRef.current.width = CELL_SIZE * WORLD_WIDTH
      setContext(ctx)
      setStartButton(true)
      document.addEventListener('keydown', (e) => {
        e.preventDefault()
        switch (e.code) {
          case 'ArrowUp':
          case 'KeyW':
            scene1?.change_direction(MoveDirection.UP)
            break
          case 'ArrowDown':
          case 'KeyS':
            scene1?.change_direction(MoveDirection.Down)
            break
          case 'ArrowLeft':
          case 'KeyA':
            scene1?.change_direction(MoveDirection.LEFT)
            break
          case 'ArrowRight':
          case 'KeyD':
            scene1?.change_direction(MoveDirection.RIGHT)
            break
          case 'Space':
            space = true
            break
        }
      })

      document.addEventListener('keyup', (e) => {
        switch (e.code) {
          case 'Space':
            space = false
            break
        }
      })
      return () => {
        clearTimeout(timeout)
        stop = true
      }
    }
    wasExecutedRef.current = true
  }, [])
  return (
    <div className="h-1/2 w-1/2">
      <div className="mb-3 text-sm">
        Rule: <br />
        <b>W</b> OR <b>Up</b> key is moving up, <b>A</b> OR <b>Right</b> key is moving up,
        <br />
        <b>D</b> OR <b>Left</b> key is moving up,<b>S</b> OR <b>Down</b> key is moving up,
        <br />
        Space is to speed up, when speed up you double the point <br />
      </div>
      <div className="mb-3 flex justify-between">
        <div>
          {' '}
          Your Point is: <b>{point}</b>
        </div>
        <div className="text-green">{stateText}</div>
        <br />
      </div>
      <canvas className="mb-3" id="examplecanvas" ref={canvasRef} width={200} height={200} />
      <div>
        {sceneReady && startButton ? (
          <button
            type="button"
            onClick={play}
            className="w-full rounded-md bg-primary-500 py-2 px-4 font-medium text-white sm:py-0"
          >
            Start
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default SnakeGame
