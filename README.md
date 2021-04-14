# Pending Author Response action 📫

Remove a `pending-response-label` from an issue, if present, when the **original issue author** responds.

Optionally, add a follow-up label (`actionable-label`) to highlight that an action is required by the team.

The labels must exist in the repo in order for the action to add them to an issue.

## Inputs

| Input                    | Default | Required | Description                                                                    |
| ------------------------ | ------- | -------- | ------------------------------------------------------------------------------ |
| `github-token`           |         | true     | The GitHub token used to create an authenticated client                        |
| `pending-response-label` |         | true     | Label to remove indicating that a response is required for further action      |
| `actionable-label`       |         | false    | Label added to highlight that a user has responded and a follow-up is required |

## Usage

You can use the action by referencing the v1 branch:

```yaml
name: pending-author-response
on:
  issue_comment:
    types: [created]

jobs:
  issue_commented:
    runs-on: ubuntu-latest
    steps:
      - uses: siegerts/pending-author-response@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          pending-response-label: pending-response
```

### Adding an `actionable-label`

```yaml
name: pending-author-response
on:
  issue_comment:
    types: [created]

jobs:
  issue_commented:
    runs-on: ubuntu-latest
    steps:
      - uses: siegerts/pending-author-response@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          pending-response-label: pending-response
          actionable-label: follow-up
```

### Skip action unless the label is present on the issue and it's **not** a PR

Note: `contains(github.event.issue.labels.*.name, 'pending-response')` matches the label used in `pending-response-label` value.

```diff
  name: pending-author-response
  on:
    issue_comment:
      types: [created]

  jobs:
    issue_commented:
+     if: ${{ !github.event.issue.pull_request  && contains(github.event.issue.labels.*.name, 'pending-response') }}
      runs-on: ubuntu-latest
      steps:
        - uses: siegerts/pending-author-response@v1
          with:
            github-token: ${{ secrets.GITHUB_TOKEN }}
            pending-response-label: pending-response
```
