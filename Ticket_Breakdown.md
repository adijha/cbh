# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here


### Ticket 1: Add ability for Facilities to save custom Agent ids

Acceptance criteria:
- Facilities can create a custom id for each Agent they work with.
- The custom id is saved in the database.
- The custom id is used when generating reports for the Facility.

Time/effort estimate: 4 hours

Implementation details:
- Create a new table in the database to store the custom Agent ids.
- The table should have the following columns:
```
id: The primary key of the table.
facility_id: The id of the Facility that owns the custom id.
agent_id: The internal database id of the Agent.
custom_id: The custom id for the Agent.
```
- Update the getShiftsByFacility function to return the custom Agent id, if it exists, instead of the internal database id.
- The function should first check the custom_ids table to see if there is a custom id for the Agent. If there is, the function should return the custom id. If there is not, the function should return the internal database id.
- Update the generateReport function to use the custom Agent id, if it exists, instead of the internal database id.
- The function should first check the custom_ids table to see if there is a custom id for the Agent. If there is, the function should use the custom id. If there is not, the function should use the internal database id.

### Ticket 2: Update unit tests to cover custom Agent ids

Acceptance criteria:
- The unit tests for the getShiftsByFacility and generateReport functions should pass when using custom Agent ids.

Time/effort estimate: 2 hours

Implementation details:

- Update the unit tests for the getShiftsByFacility and generateReport functions to pass when using custom Agent ids.
- The unit tests should first create a custom id for an Agent. Then, the unit tests should call the getShiftsByFacility and generateReport functions with the custom id
- The unit tests should then verify that the custom id is used correctly.

### Ticket 3: Update documentation to reflect custom Agent ids

Acceptance criteria:
- The documentation for the getShiftsByFacility and generateReport functions should be updated to reflect the use of custom Agent ids.

Time/effort estimate: 0.5 hours

Implementation details: 
- Update the documentation for the getShiftsByFacility and generateReport functions to reflect the use of custom Agent ids. * The documentation should include a section that describes how to create and use custom Agent ids.


Total time/effort estimate: 6.5 hours
