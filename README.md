# Salesforce Lightning Table with Client Side Pagination.

> Salesforce Lightning Table with client-side pagination. Download the entire project and use core logic for pagination in your projects. 

### Component Names:
1. hybridTable.cmp: Main table component.
2. hybridTableController.js: Component's js controller.
3. hybridTableHelper.js: Component's js helper. This includes the logic for calling server to get _serialized_ data for Table in _JSON_ format.
4. HybridTableController: Apex controller that provides data for table.

### Initialize the table like this:
```
<hybridTable
	sObjectAPIName="Account"
	fieldAPINames="Name, AccountNumber, Rating"
	tableSOQL="SELECT ID, Name, AccountNumber, Rating FROM Account"
	visibleRowsCount="5"
/>
```

### Table Attributes:
   1. sObjectAPIName: This is the SObject API for which data is to be displayed in Table.
   2. fieldAPINames: This is a comma separated String of Field API Names to be displayed in the Table.
   3. tableSOQL: This is the SOQL that is to be used to fetch data from Salesforce. 
   	  TODO: Change this implementation as per your use case.
   4. visibleRowsCount: Number of rows to be displayed on one page of Table.


### Clone the entire project:
```
git clone https://github.com/SalesforceX/Client-Side-Pagination-In-Lightning-Table.git
```

