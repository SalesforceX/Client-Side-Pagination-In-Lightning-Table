({
	init : function(component, event, helper) {
		helper.getSerializedDataHF(component);
	},
    loadFirstPage : function(component, event, helper) {
		helper.loadFirstPageHF(component);
	},
    loadPreviousPage : function(component, event, helper) {
		helper.loadPreviousPageHF(component);
	},
    loadNextPage : function(component, event, helper) {
		helper.loadNextPageHF(component);
	},
    loadLastPage : function(component, event, helper) {
		helper.loadLastPageHF(component);
	}
})