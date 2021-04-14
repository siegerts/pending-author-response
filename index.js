const github = require("@actions/github");
const core = require("@actions/core");

/**
 * Remove a `pending-response-label` from an issue,
 * if present, when the original issue author responds.
 *
 * Optionally, add a follow-up label (`actionable-label`)
 * to highlight that an action is required by the team.
 *
 */
async function run() {
  const token = core.getInput("github-token", { required: true });

  const pendingResponseLabel = core.getInput("pending-response-label", {
    required: true,
  });

  const actionableLabel = core.getInput("actionable-label") || "";

  // context
  const context = github.context;
  const repo = context.repo;
  const issue = context.payload.issue;
  const comment = context.payload.comment;

  if (!repo || !comment) {
    core.setFailed(
      "Missing repo or comment information from the event payload"
    );
  }

  // original author
  const isOriginalAuthor = issue.user.login === comment.user.login;

  // issue labels
  const labels = issue.labels || [];

  const isPendingResponse = labels.some(
    ({ name }) => name === pendingResponseLabel
  );

  // issue doesn't include pending response label
  // could also be caught in workflow definition
  if (!isPendingResponse) {
    core.info("Issue isn't labeled as pending response. Skipping...");
    return;
  }

  if (isOriginalAuthor) {
    const octo = github.getOctokit(token);

    core.info(`Issue author commented...`);
    core.info(`-Updating issue #${issue.number}...`);
    core.info(`--Removing <${pendingResponseLabel}> label...`);

    await octo.issues.removeLabel({
      owner: repo.owner,
      repo: repo.repo,
      issue_number: issue.number,
      name: pendingResponseLabel,
    });

    // if configured, add follow up label
    if (actionableLabel) {
      core.info(`--Adding <${actionableLabel}> label...`);
      await octo.issues.addLabels({
        owner: repo.owner,
        repo: repo.repo,
        issue_number: issue.number,
        labels: [actionableLabel],
      });
    }
  }
}

run();
