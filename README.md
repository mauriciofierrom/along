**NOTE:** This is still a work in progress

# Along

Along is a web application to practice along to YouTube instrument instruction
videos.

## Motivation

- Updating Ruby on Rails knowledge
- Learning Hotwired tools (Turbo and Stimulus)
- Using modern CSS features
- Using vanilla JS with modern features
- Improving my guitar learning process

# Test

Run all the bun specs:

`bun test --isolate`

The isolate flag is required for mocked modules to not be leaked into other
tests until bun fixes the behaviour.

Run a focused spec:

Add `.only` to the `it`/`describe` and run with the --only flag

`bun test --only`

Watch mode:

`bun test --watch`
