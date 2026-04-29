---
name: Feature Request
description: Suggest an idea for this project
title: "[FEATURE]: "
labels: ["enhancement"]
assignees: []

body:
  - type: textarea
    id: problem
    attributes:
      label: What problem does this solve?
      description: Describe the problem or use case
      placeholder: What's the pain point?
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Proposed solution
      description: How should this be implemented?
      placeholder: Describe your idea...
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives considered
      description: Any other approaches you thought of
      placeholder: Are there other ways to solve this?
    validations:
      required: false

