/*
The MIT License

Copyright (c) 2018 PankaJ Jakhar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
public with sharing class HybridTableController {
    private static final String DEFAULT_PAGE_NAME = 'vfPage';

    @AuraEnabled
    public static String getSerializedData(String sObjectAPIName,
            String fieldAPINames,
            String tableSOQL) {
        System.debug('-----sObjectAPIName-----:' + sObjectAPIName);
        System.debug('-----fieldAPINames-----:' + fieldAPINames);
        System.debug('-----tableSOQL-----:' + tableSOQL);

        Map<String, String> fieldsMap = getFieldsMap(sObjectAPIName);
        List<String> fieldAPINamesList = fieldAPINames.split(',');

        Set<String> columnNamesSet = new Set<String>();
        Set<String> fieldAPIsSet = new Set<String>();

        for (String fieldAPI : fieldAPINamesList) {
            String api = fieldAPI.trim().toLowerCase();
            System.debug('-----api-----:' + api);
            fieldAPIsSet.add(api);
            columnNamesSet.add(fieldsMap.get(api));
        }

        System.debug('-----columnNamesSet-----:' + columnNamesSet);
        List<SObject> recordsList = Database.query(tableSOQL);
        List<Row> rowsList = populateRows(recordsList, fieldAPIsSet);

        Table table = new Table();
        table.fieldNamesSet = columnNamesSet;
        table.rowsList = rowsList;

        return JSON.serialize(table);
    }

    private static List<Row> populateRows(List<SObject> recordsList, Set<String> fieldNamesSet) {
        List<Row> rowsList = new List<Row>();

        for (SObject record : recordsList) {
            Row rowData = new Row();
            rowData.recordID = record.ID;

            for (String fieldName : fieldNamesSet) {
                FieldInfo fieldInfo = new FieldInfo();
                fieldInfo.fieldAPIName = fieldName;
                fieldInfo.fieldValue = record.get(fieldName);

                rowData.fieldInfoList.add(fieldInfo);
            }
            rowsList.add(rowData);
        }

        return rowsList;
    }

    public class Table {
        public Set<String> fieldNamesSet { get; set; }
        public List<Row> rowsList { get; set; }

        public Table() {
            fieldNamesSet = new Set<String>();
            rowsList = new List<Row>();
        }
    }

    public class Row implements Comparable {
        public String recordID { get; set; }
        public List<FieldInfo> fieldInfoList { get; set; }
        public String pivot { get; set; } // To sort.

        public Row() {
            fieldInfoList = new List<FieldInfo>();
        }

        public Integer compareTo(Object compareTo) {
            return 0;
        }
    }

    public class Header {
        public List<String> fieldNamesList { get; set; }

        public Header() {
            fieldNamesList = new List<String>();
        }
    }

    public class FieldInfo {
        public String fieldAPIName { get; set; }
        public Object fieldValue { get; set; }
    }

    /**
     * Source: https://github.com/SalesforceX/Utilities/blob/master/src/classes/SFObjectUtil.cls
     * Get the fields of specific types only.
     *
     */
    public static Map<String, String> getFieldsMap(String objectAPI) {
        Schema.DescribeSObjectResult[] descResultsList = Schema.describeSObjects(
                new String[]{
                        objectAPI
                });
        Schema.DescribeSObjectResult descResult = descResultsList[0];
        Map<String, Schema.SObjectField> fieldsMap = descResult.fields.getMap();

        Map<String, String> fieldAPIToNameMap = new Map<String, String>();
        for (Schema.SObjectField field : fieldsMap.values()) {
            Schema.DescribeFieldResult dFieldResult = field.getDescribe();
            String fieldLabel = dFieldResult.getLabel();
            String fieldName = dFieldResult.getName();
            fieldAPIToNameMap.put(fieldName.toLowerCase(), fieldLabel);
        }
        return fieldAPIToNameMap;
    }
}