use std::vec;

use js_sys::Math;
use log::Level;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(PartialEq, Debug)]
pub enum MoveDirection {
    UP,
    Down,
    LEFT,
    RIGHT,
}

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub enum GameState {
    WIN,
    LOSS,
    PLAY,
}
struct Snake {
    body: Vec<usize>,
    direction: MoveDirection,
}

impl Snake {
    fn new() -> Snake {
        Snake {
            body: vec![10],
            direction: MoveDirection::LEFT,
        }
    }

    fn reset(&mut self) {
        self.body.clear();
        self.body.push(10);
        self.direction = MoveDirection::LEFT;
    }
}

#[wasm_bindgen]
pub struct Scene {
    width: usize,
    size: usize,
    game_state: Option<GameState>,
    reward: Option<usize>,
    snake: Snake,
    vec_holder: Vec<usize>,
    point: usize,
}

#[wasm_bindgen]
impl Scene {
    pub fn new(width: usize) -> Scene {
        let size = width * width;
        let snake = Snake::new();
        let mut vec_holder = vec![];
        for i in 0..size {
            vec_holder.push(i);
        }
        Scene {
            width,
            size,
            game_state: Some(GameState::PLAY),
            reward: Scene::create_reward(&snake.body, &vec_holder),
            snake,
            vec_holder,
            point: 0,
        }
    }

    pub fn change_direction(&mut self, direction: MoveDirection) {
        if direction == MoveDirection::Down && self.snake.direction == MoveDirection::UP
            || direction == MoveDirection::UP && self.snake.direction == MoveDirection::Down
            || direction == MoveDirection::LEFT && self.snake.direction == MoveDirection::RIGHT
            || direction == MoveDirection::RIGHT && self.snake.direction == MoveDirection::LEFT
        {
            return;
        }
        self.snake.direction = direction;
    }

    pub fn snake_head(&self) -> usize {
        self.snake.body[0]
    }

    pub fn snake_length(&self) -> usize {
        self.snake.body.len()
    }

    pub fn snake_body(&self) -> Vec<usize> {
        self.snake.body.clone()
    }

    pub fn get_reward(&self) -> usize {
        self.reward.unwrap()
    }

    pub fn get_point(&self) -> usize {
        self.point
    }

    pub fn get_game_status(&self) -> Option<GameState> {
        self.game_state
    }

    pub fn reset(&mut self) {
        self.point = 0;
        self.game_state = Some(GameState::PLAY);
        self.snake.reset();
        self.reward = Scene::create_reward(&self.snake.body, &self.vec_holder);
    }

    fn create_reward(snake_body: &Vec<usize>, vec_holder: &Vec<usize>) -> Option<usize> {
        let mut grid = vec_holder.clone();
        grid.retain(|x| !snake_body.contains(x));
        let reward = (Math::random() * grid.len() as f64).floor() as usize;
        Some(reward)
    }

    pub fn update(&mut self, space_pressed: bool) {
        match self.game_state {
            Some(GameState::PLAY) => {
                let snake_head = self.snake_head();
                let row = snake_head / self.width;
                let mut next = 0;
                let mut trehold = 0;
                match self.snake.direction {
                    MoveDirection::LEFT => {
                        trehold = row * self.width;
                        next = snake_head - 1;
                        if snake_head == trehold {
                            self.game_state = Some(GameState::LOSS);
                            return;
                        }
                    }
                    MoveDirection::RIGHT => {
                        trehold = (row + 1) * self.width;
                        next = snake_head + 1;
                        if next == trehold {
                            self.game_state = Some(GameState::LOSS);
                            return;
                        }
                    }
                    MoveDirection::UP => {
                        trehold = snake_head - (row * self.width);
                        next = snake_head - self.width;
                        if snake_head == trehold {
                            self.game_state = Some(GameState::LOSS);
                            return;
                        }
                    }
                    MoveDirection::Down => {
                        trehold = snake_head + ((self.width - row) * self.width);
                        next = snake_head + self.width;
                        if next == trehold {
                            self.game_state = Some(GameState::LOSS);
                            return;
                        }
                    }
                }
                let tmp = self.snake.body.clone();
                self.snake.body[0] = next;

                for i in 1..self.snake_length() {
                    self.snake.body[i] = tmp[i - 1];
                }

                if self.snake.body[1..self.snake_length()].contains(&self.snake.body[0]) {
                    self.game_state = Some(GameState::LOSS);
                    return;
                }

                if self.reward == Some(self.snake.body[0]) {
                    if self.snake_length() < self.size {
                        self.reward = Scene::create_reward(&self.snake.body, &self.vec_holder);
                        if space_pressed {
                            self.point += 2;
                        } else {
                            self.point += 1;
                        }
                    } else {
                        self.reward = None;
                        self.game_state = Some(GameState::WIN);
                        return;
                    }
                    self.snake.body.push(tmp[tmp.len() - 1]);
                }
            }
            _ => {}
        }
    }
}

#[wasm_bindgen]
pub fn hello_world() {
    console_log::init_with_level(Level::Debug).expect("error initializing log");
    log::info!("Hello World");
}

#[wasm_bindgen]
pub fn add(a: u32, b: u32) -> u32 {
    a + b
}
