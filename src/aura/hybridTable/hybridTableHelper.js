/*
The MIT License

Copyright (c) 2010-2018 Google, Inc. http://angularjs.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
({
    getSerializedDataHF: function(component) {
        var sObjectAPIName = component.get("v.sObjectAPIName");
        var fieldAPINames = component.get("v.fieldAPINames");
        var tableSOQL = component.get("v.tableSOQL");
        
        var action = component.get("c.getSerializedData");
        action.setParams({
            "sObjectAPIName" : sObjectAPIName,
            "fieldAPINames" : fieldAPINames,
            "tableSOQL" : tableSOQL
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var tableSerialized = response.getReturnValue();
                
                var tableJSON = JSON.parse(tableSerialized);
                
                // Initialize rowsList and fieldNamesSet
                component.set("v.rowsList", tableJSON.rowsList);
                component.set("v.fieldNamesSet", tableJSON.fieldNamesSet);
                
                var rowsCount = tableJSON.rowsList.length;                
                var visibleRowsCount = component.get("v.visibleRowsCount");
                
                var remainingRows = rowsCount % visibleRowsCount;
                
                var totalPages = Math.floor(rowsCount / visibleRowsCount);
                if(remainingRows > 0) totalPages += 1;
                component.set('v.totalPages', totalPages);
                
                // Get page index variables.
                var currentPageIndex = component.get("v.currentPageIndex");
                var firstPageIndex = component.get("v.firstPageIndex");
                var previousPageIndex = component.get("v.previousPageIndex");
                var nextPageIndex = component.get("v.nextPageIndex");
                var lastPageIndex = component.get("v.lastPageIndex");
                
                // Initialize page indices to 0.
                currentPageIndex = 0;
                firstPageIndex = 0;
                previousPageIndex = 0;
                lastPageIndex = 0;
                nextPageIndex = 0;
                
                // Refresh table after index changes
                this.refreshTable(component, currentPageIndex, 
                                  firstPageIndex, previousPageIndex, 
                                  nextPageIndex, lastPageIndex);
            }
        });
        $A.enqueueAction(action);
    },
    loadNextPageHF : function(component) {
        // Get all page indices.
        var currentPageIndex = component.get("v.currentPageIndex");
        var firstPageIndex = component.get("v.firstPageIndex");
        var previousPageIndex = component.get("v.previousPageIndex");
        var nextPageIndex = component.get("v.nextPageIndex");
        var lastPageIndex = component.get("v.lastPageIndex");
        
        // Move current, previous and next page indices.
        currentPageIndex += 1;
        previousPageIndex += 1;
        nextPageIndex += 1;
        
        // Refresh table after index changes
        this.refreshTable(component, currentPageIndex, 
                          firstPageIndex, previousPageIndex, 
                          nextPageIndex, lastPageIndex);
    },
    loadPreviousPageHF : function(component) {
        // Get all page indices.
        var currentPageIndex = component.get("v.currentPageIndex");
        var firstPageIndex = component.get("v.firstPageIndex");
        var previousPageIndex = component.get("v.previousPageIndex");
        var nextPageIndex = component.get("v.nextPageIndex");
        var lastPageIndex = component.get("v.lastPageIndex");
        
        // Move current, previous and next page indices.
        currentPageIndex -= 1;
        previousPageIndex -= 1;
        nextPageIndex -= 1;
        
        // Refresh table after index changes
        this.refreshTable(component, currentPageIndex, 
                          firstPageIndex, previousPageIndex, 
                          nextPageIndex, lastPageIndex);
    },
    loadFirstPageHF : function(component) {
        // Get all page indices.
        var currentPageIndex = component.get("v.currentPageIndex");
        var firstPageIndex = component.get("v.firstPageIndex");
        var previousPageIndex = component.get("v.previousPageIndex");
        var nextPageIndex = component.get("v.nextPageIndex");
        var lastPageIndex = component.get("v.lastPageIndex");
        
        currentPageIndex = 0;
        firstPageIndex = 0;
        previousPageIndex = 0;
        nextPageIndex = 0;
        
        // Refresh table after index changes
        this.refreshTable(component, currentPageIndex, 
                          firstPageIndex, previousPageIndex, 
                          nextPageIndex, lastPageIndex);
    },
    loadLastPageHF : function(component) {
        // Get all page indices.
        var currentPageIndex = component.get("v.currentPageIndex");
        var firstPageIndex = component.get("v.firstPageIndex");
        var previousPageIndex = component.get("v.previousPageIndex");
        var nextPageIndex = component.get("v.nextPageIndex");
        var lastPageIndex = component.get("v.lastPageIndex");
        var totalPages = component.get("v.totalPages"); 
        
        // Change indices.
        currentPageIndex = totalPages - 1;
        nextPageIndex = currentPageIndex;
        previousPageIndex = currentPageIndex;
        lastPageIndex = currentPageIndex;
        
        // Refresh table after index changes
        this.refreshTable(component, currentPageIndex, 
                          firstPageIndex, previousPageIndex, 
                          nextPageIndex, lastPageIndex);
    },
    refreshTable : function(component, currentPageIndex, 
                            firstPageIndex, previousPageIndex,
                            nextPageIndex, lastPageIndex) {
        var rowsList = component.get("v.rowsList");
        var visibleRowsCount = component.get("v.visibleRowsCount");
        
        // Rows; which will be visible in the table.
        var visibleRowsList = [];
        
        var rowIndexStart = currentPageIndex * visibleRowsCount;
        visibleRowsCount += rowIndexStart;
        for(var rowIndex = rowIndexStart; rowIndex < visibleRowsCount; rowIndex++) {
            visibleRowsList.push(rowsList[rowIndex]);
        }
        
        // Set attributes after changes.
        component.set("v.visibleRowsList", visibleRowsList);
        component.set("v.currentPageIndex", currentPageIndex);
        component.set("v.firstPageIndex", firstPageIndex);
        component.set("v.previousPageIndex", previousPageIndex);
        component.set("v.nextPageIndex", nextPageIndex);
        component.set("v.lastPageIndex", lastPageIndex);
    }
})