RETROSPECTIVE - TEAM 9
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics
- Number of stories committed vs done: 8 / 7
- Total points committed vs done: 39 / 36
- Nr of hours planned vs spent (as a team):
	- Estimated: 39h 30m
	- Logged:	41h 31m

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#18_  |    5    |    5   |     4h     |   4h 28m     |
| _#19_  |    3    |    3   |     4h     |   4h 18m     |
| _#20_  |    2    |   13   |    11h     |  10h 32m     |
| _#21_  |    2    |    2   |    4h      |     4h       |
| _#22_  |    1    |    5   |    2h      |   3h 25m     |
| _#23_  |    1    |    3   |    1h      |   1h 25m     |
| _#24_  |    4    |    5   |  6h 20m    |   6h 30m     |

note: #21bis was already done as part of the story 9 so we didn’t spend other time to implement it.

story #0 contains technical_tasks and issues

average = 41h 31m / 18 = 2h 18m 23s

Standard Deviation: 1.5985519102852

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table

Task estimation error ratio = 39h 30m /41h 31m = 0,9514

## QUALITY MEASURES	
- Unit Testing:
    - Total hours estimated: 5h 30m
    - Total hours spent: 6h 29m
    - Nr of automated unit test cases: 107 (DAO) + 57 (server)
    - Coverage (if available): 80.2%
- E2E testing:
     - Total hours estimated: 1h 45m
    - Total hours spent: 1h 44m
- Code review
     - Total hours estimated: 15m
     - Total hours spent: 14m  
- Technical Debt management:
     - Total hours estimated : 5h 45m 
     - Total hours spent : 46m (some technical debts remained undone due lack of time)
     - Hours estimated for remediation by SonarQube: 2h 30m
     - Hours spent on remediation : 46m
     - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.1%
     - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ):
 		- Reliability: A
 		- Security: A
 		- Maintainability: A

## ASSESSMENT
- What caused your errors in estimation (if any)?
	- Our task estimation error is 0,9514; we think it’s acceptable.

- What lessons did you learn (both positive and negative) in this sprint?
	- Positive: we learnt to not over implement a story, that is it is important to do just what is requested by the story topic without foreseeing possible future extensions, as the agile methodology requests;
    - Negative: we tend to finalize the project in the previous day of the sprint review, which is not good; indeed, in the last sprint review the story 17 could not have been presented due to some undiscovered bug that came up in the previous day;

- Which improvement goals set in the previous retrospective were you able to achieve?
	- We managed better Git merges thanks to coordination: for instance, who did refactoring of folders in the front end did the work after all the others and when their work was completed; during that time, everyone was strongly discouraged to push any modification on the repo.

- Which ones were you not able to achieve? Why?
	- We achieved all improvements set in the previous retrospective (it was related to perfect coordination on git regarding merging stories).

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
	- We want to finalize the sprint at least two days before the sprint review in order to fix eventual bugs that may stem from interference of stories to each other or retrocompatibility.

- One thing you are proud of as a Team!!
	- We are proud that we did a lot of stories with a velocity that increased more and more along sprints, and we foresee that this trend would have remained stable in an hypothetical further sprint.
