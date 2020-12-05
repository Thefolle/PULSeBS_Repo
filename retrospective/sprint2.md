RETROSPECTIVE - TEAM 9
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics
- Number of stories committed vs done: 6 / 6
- Total points committed vs done: 22 / 22
- Nr of hours planned vs spent (as a team)
    - Estimated: 34h 45m
    - Logged: 40h 23m

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    6    |    -   |  9h 45m    |   10h 50m    |
| _#4_   |    1    |    5   |  1h 30m    |     5h       |
| _#5_   |    3    |    2   |    4h      |   2h 45m     |
| _#6_   |    1    |    5   |    4h      |   1h 23m     |
| _#7_   |    3    |    3   |  4h 30m    |   2h 45m     |
| _#8_   |    2    |    2   |    4h      |   1h 40m     |
| _#9_   |    4    |    5   |    7h      |    16h       |

###### _story #0 contains technical_tasks and issues_

**Average** = 40h 23m / 20 = 2h 1m 9s

**Standard Deviation**, σ: 1.8222564995082

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table

- Task estimation error ratio = 34h 45m /40h 23m =0.8605

## QUALITY MEASURES
- Unit Testing:
    - Total hours estimated: 8h 35m
    - Total hours spent: 6h 25m
    - Nr of automated unit test cases: 25 (DAO) + 9 (server)
    - Coverage (if available): 52.8%
- E2E testing:
    - Total hours estimated: 4h
    - Total hours spent: 7h 35m
- Code review
    - Total hours estimated: 12h
    - Total hours spent: 13h 30m 
- Technical Debt management:
    - Total hours estimated : 3h
    - Total hours spent : 4h 30m
    - Hours estimated for remediation by SonarQube: 2h 52m
    - Hours spent on remediation : 0h
    - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.7
    - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ):
	    - Reliability: A
	    - Security: B
	    - Maintainability: A

## ASSESSMENT
- What caused your errors in estimation (if any)?
	- Fixing some bug on main branch after others stories’ branches have been merged.

- What lessons did you learn (both positive and negative) in this sprint?
	- Positive: We are improving our extra-story tasks organization in JIRA ( like Scrum meetings, technical meetings, technical debts, technical task) 
	- Negative: We aren’t good enough in coordination regarding branches’ merging. Often some errors born after a couple of merges into main.

- Which improvement goals set in the previous retrospective were you able to achieve?
	- We reserved some time for technical debts and in this sprint we achieved 1 technical debt ( we estimated it and did it ). Of course it’s still very poor but we hope that we’ll do better next sprint.

- Which ones you were not able to achieve? Why?
	- We probably didn’t achieve a better code quality due problems with all merging in main. At the end we found some errors and we did all the possible with our remaining hours.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
	- Achieve a better coordination on git regarding merging stories’ branch into main one
	- Still spending more time on technical debts and code quality
	- Reducing estimation error(both under and over)

- One thing you are proud of as a Team!!
	- We are proud of our members’ AGILE skills as a team. We’re growing as expected and our AGILE method is becoming sharper than before.
