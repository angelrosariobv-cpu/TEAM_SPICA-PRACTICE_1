# Team Spica — AI Agent Instructions

## 1. Project Context

Team Spica develops a flight management application using:

* Backend: Python, FastAPI, SQLAlchemy.
* Database: Azure Database for PostgreSQL.
* Frontend: React, TypeScript, Vite, Tailwind CSS and shadcn/ui.
* Version control: Git and GitHub.

The frontend may not exist yet. Always verify the actual repository structure before assuming that a component is implemented.

## 2. Core Principles

All agents must:

1. Inspect existing code before proposing changes.
2. Prefer simple, maintainable solutions.
3. Follow established project conventions.
4. Reuse existing functionality when appropriate.
5. Avoid unnecessary dependencies and abstractions.
6. Preserve existing behavior unless changes are explicitly requested.
7. Distinguish verified facts from assumptions.

Use the installed Ponytail skills when relevant.

Apply React Best Practices and Frontend Design when working on applicable frontend tasks.

Do not apply framework-specific recommendations that conflict with the project's actual architecture.

## 3. Repository Exploration

Before searching for files:

1. Identify the repository root.
2. Inspect the top-level directory structure.
3. Verify that the target directory exists.
4. Search only relevant locations.

If a requested directory does not exist:

* Report its absence.
* Stop searching for that directory.
* Do not create it without authorization.

Never perform repeated searches without a clear reason.

Exclude irrelevant directories such as:

* `.git/`
* `.venv/`
* `node_modules/`
* `__pycache__/`

### Exploration Limits

* Prefer one targeted search over repeated repository-wide searches.
* If a search fails, inspect the error before retrying.
* Do not repeat identical failed commands.
* After three unsuccessful attempts without meaningful new information, stop and report the obstacle.
* Ask for clarification when necessary.

## 4. No Fabrication

Never invent:

* API endpoints.
* Database tables or columns.
* Request or response schemas.
* Environment variables.
* Existing files or directories.
* Installed dependencies.
* Test results.
* Application behavior.

Before integrating an API endpoint, inspect its actual implementation or documented contract.

If required information is unavailable, explain what is missing.

## 5. Code Modification Rules

Before editing:

1. Identify the files directly related to the task.
2. Understand their current implementation.
3. Determine the smallest necessary change.
4. Preserve unrelated functionality.

Do not:

* Modify unrelated files.
* Refactor working code without justification.
* Change database schemas without authorization.
* Modify Azure infrastructure without authorization.
* Install dependencies without authorization.
* Initialize new applications without authorization.
* Delete files without authorization.

Reading files and running non-destructive inspections are permitted.

## 6. Git Safety

Never perform the following without explicit authorization:

* `git commit`
* `git push`
* `git merge`
* `git rebase`
* Branch deletion.
* Destructive resets.
* Force pushes.

Do not modify Git configuration or repository protection rules without permission.

## 7. Frontend Conventions

When working with React and TypeScript:

* Prefer functional components.
* Use clear and descriptive identifiers.
* Avoid unnecessary use of `any`.
* Keep components focused and reusable.
* Follow existing directory conventions.
* Use semantic HTML and accessible controls.
* Handle loading, error and empty states.
* Avoid unnecessary state management libraries.
* Verify dependencies before importing them.

Do not assume that Next.js is installed.

Do not introduce Next.js-specific patterns into the Vite application unless explicitly requested.

## 8. Backend and Database Safety

The backend is implemented with FastAPI.

Before making changes:

* Inspect existing routers.
* Inspect Pydantic schemas.
* Inspect SQLAlchemy models.
* Preserve API contracts.
* Preserve database compatibility.

Do not invent database migrations or alter PostgreSQL tables without authorization.

Never expose credentials, connection strings or secrets.

## 9. Validation

After modifying code:

1. Run relevant checks that are already configured.
2. Inspect errors.
3. Report which checks passed or failed.
4. Explain any validation that could not be performed.

Never claim that code works without sufficient verification.

Do not install testing frameworks without authorization.

## 10. Stop Conditions

Stop and request guidance when:

* A required directory does not exist.
* An endpoint cannot be verified.
* Required information is missing.
* A change requires modifying an unauthorized component.
* A dependency must be installed.
* A database schema change appears necessary.
* Repeated attempts are not producing new information.

Do not attempt endless autonomous troubleshooting.

## 11. Communication

* Communicate with Team Spica developers in Spanish.
* Write code and technical identifiers in English.
* Explain significant architectural decisions.
* Be concise and specific.
* Clearly distinguish completed actions from proposed actions.

## 12. Completion Report

After completing a development task, summarize:

1. Files inspected.
2. Changes made.
3. Tests executed.
4. Remaining issues.
5. Decisions requiring developer approval.

If no files were modified, state that explicitly.
