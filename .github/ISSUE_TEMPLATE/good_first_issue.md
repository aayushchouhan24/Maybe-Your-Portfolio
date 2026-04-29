---
name: Good First Issue
description: Perfect for newcomers - easy wins to get started
title: "[GOOD FIRST ISSUE]: "
labels: ["good first issue"]
assignees: []

body:
  - type: textarea
    id: task
    attributes:
      label: Task
      description: What needs to be done?
      placeholder: Describe the task clearly...
    validations:
      required: true

  - type: textarea
    id: details
    attributes:
      label: How to get started
      description: Guide for new contributors
      placeholder: |
        - File to modify: src/...
        - What to change: ...
        - Example: ...
    validations:
      required: true

  - type: textarea
    id: references
    attributes:
      label: References
      description: Links to relevant code or docs
      placeholder: Links to files or documentation...
    validations:
      required: false
