RETROSPECTIVE - TEAM 9
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics
- Number of stories committed vs done: 7 / 7
- Total points committed vs done: 47 / 47
- Nr of hours planned vs spent (as a team)
    - Estimated: 60h
    - Logged: 59h 50m

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#10_  |    10   |    8   |  16h       |   16h 2m     |
| _#11_  |    3    |    8   |  8h 30m    |     8h 42m   |
| _#12_  |    5    |    13  |    16h 30m |   15h 31m    |
| _#13_  |    3    |    5   |    6h      |   5h 20m     |
| _#14_  |    2    |    3   |  4h        |   3h 20m     |
| _#15_  |    2    |    2   |    3h      |   2h 45m     |
| _#16_  |    2    |    8   |    6h      |    8h 10m    |

###### _story #0 contains technical_tasks and issues_

**Average** = 59h 50m / 27 = 2h 12m 58s

**Standard Deviation**, σ: 1.4418904296006

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table
    - Task estimation error ratio = 60h /59h 50m = 1.003

## QUALITY MEASURES
- Unit Testing:
    - Total hours estimated: 15h
    - Total hours spent: 10h 6m
    - Nr of automated unit test cases: 52 (DAO) + 32 (server)
    - Coverage (if available): 56.61%
- E2E testing:
    - Total hours estimated: 2h
    - Total hours spent: 27m
- Code review
    - Total hours estimated: 1h 30m
    - Total hours spent: 1h 15m 
- Technical Debt management:
    - Total hours estimated : 3h 30m
    - Total hours spent : 2h 40m
    - Hours estimated for remediation by SonarQube: 5h 34m
    - Hours spent on remediation : 1h 15m
    - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.7%
    - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ):
	    - Reliability: A
	    - Security: A
	    - Maintainability: A

## ASSESSMENT
- What caused your errors in estimation (if any)?
	- Our task estimation error is 1.003, so for this sprint we didn’t many errors in estimation.

- What lessons did you learn (both positive and negative) in this sprint?
	- Positive: We didn't exceed our time reserved for story implementation in order to make some SonarCloud remediation and technical debts ( estimation and implementation)
    - Negative: We encountered just one case of overwriting after some consecutive mergings from different team member.

- Which improvement goals set in the previous retrospective were you able to achieve?
    - We achieved a good estimation error also we did remediation and solved technical debts.
    
- Which ones you were not able to achieve? Why?
    - We didn't achieve a perfect coordination on git regarding merging stories’ branch into main one. Probably this is because everyone has not a perfect view of other people’s job. This happened just 1 time at the end.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
	- Achieve a perfect coordination on git regarding merging stories’ branch into main one

- One thing you are proud of as a Team!!
    - We are proud of our members’ estimation skills as a team. We’re learning what we can do and how much effort stories require. Actually we are really satisfied of the work done during this sprint; it was also in previous sprints, but this was even better.
