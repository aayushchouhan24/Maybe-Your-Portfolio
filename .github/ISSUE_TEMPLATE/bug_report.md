---
name: Bug Report
description: Report a bug to help us improve
title: "[BUG]: "
labels: ["bug"]
assignees: []

body:
  - type: textarea
    id: what_happened
    attributes:
      label: What happened?
      description: Describe the bug clearly
      placeholder: Tell us what went wrong...
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected behavior
      description: What should have happened instead?
      placeholder: Describe the expected behavior...
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: Steps to reproduce
      description: How can we reproduce the issue?
      placeholder: |
        1. Go to...
        2. Click on...
        3. See error...
    validations:
      required: true

  - type: textarea
    id: environment
    attributes:
      label: Environment
      placeholder: |
        - OS: Windows/Mac/Linux
        - Browser: Chrome/Safari/Firefox
        - Node version: 
    validations:
      required: false

  - type: textarea
    id: logs
    attributes:
      label: Logs or screenshots
      description: Any relevant console logs or screenshots
      placeholder: Paste logs here...
    validations:
      required: false

