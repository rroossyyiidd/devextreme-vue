<template>
  <div>
    <h2 class="content-block">Display Data Custom</h2>

    <DxButton
            v-if="selectedDataRow.length > 0"
            text="Clear Selection"
            @click="clearSelection"
    />
    <DxDataGrid
            :data-source="dataSource"
            :show-borders="true"
            :column-auto-width="true"
            :column-hiding-enabled="true"
            :selection="selectionTableOptions"
            :group-panel="groupPanelTableOptions"
            :editing="editTable"
            @selection-changed="onSelectionChanged"
            :customize-columns="customizeColumns"
            :paging="pagingTableOptions"
            :pager="pagerTableOptions"
            :remote-operations="true"
            :row-alternation-enabled="true"
            :ref="dataGridRefName"
    >
      <!--filter data table-->
      <dx-filter-row :visible="true"/>
      <!--edit data table mode form, row and batch-->
      <DxEditing
              mode="form"
              :allow-updating="true"
              :allow-deleting="true"
              :confirm-delete="true"
              :allow-adding="true"
      >
        <DxPopup
                :show-title="true"
                title="Edit data"
        />
        <DxForm>
          <DxItem item-type="group"
                  :col-count="2"
                  :col-span="2">
            <DxItem
                    data-field="OrderDate"
                    datatype="date"
                    :validationRules="[{
                      type: 'required',
                      message: 'this field is required'
                    }]"
            />
            <DxItem
                    data-field="StoreCity"
                    :validationRules="[{
                      type: 'required',
                      message: 'this field is required'
                    }]"
            />
            <DxItem
                    data-field="StoreState"
                    :validationRules="[{
                      type: 'required',
                      message: 'this field is required'
                    }]"
            />
            <DxItem
                    data-field="Employee"
                    :validationRules="[{
                      type: 'pattern',
                      pattern: '^[a-zA-Z]+$',
                      message: 'The value should not contain digits'
                    },{
                      type: 'required',
                      message: 'this field is required'
                    }]"
            />
            <DxItem
                    data-field="SaleAmount"
                    datatype="number"
                    :validationRules="[{
                      type: 'required',
                      message: 'this field is required'
                    }]"
            />
          </DxItem>
        </DxForm>
      </DxEditing>

      <!--table column-->
      <!--for filter operations-->
      <!--docs: https://js.devexpress.com/Documentation/16_2/Guide/Widgets/DataGrid/Filtering/-->
      <DxColumn
              data-field="OrderNumber"
              caption="No Order"
              data-type="number"
              :hiding-priority="5"
              :allow-editing="false"
              :width="100"
              :filter-operations="['=', '<>', '<', '>', '<=', '>=', 'between']"
      />
      <DxColumn
              data-field="OrderDate"
              caption="Order Date"
              data-type="date"
              :hiding-priority="4"
              :allow-editing="true"
              :filter-operations="['=', '<>', '<', '>', '<=', '>=', 'between']"
      >
        <DxRequiredRule/>
      </DxColumn>
      <DxColumn
              data-field="StoreCity"
              caption="City"
              data-type="string"
              :hiding-priority="2"
              :allow-editing="true"
              :filter-operations="['contains' | 'notcontains' | 'startswith' | 'endswith' | '=' | '<>']"
      >
        <DxRequiredRule/>
        <DxStringLengthRule
                :min="3"
                message="Store city minimum 3 character"
        />
      </DxColumn>
      <DxColumn
              data-field="StoreState"
              caption="State"
              data-type="string"
              :hiding-priority="1"
              :allow-editing="true"
              :filter-operations="['contains' | 'notcontains' | 'startswith' | 'endswith' | '=' | '<>']"
      >
        <DxRequiredRule/>
        <DxStringLengthRule
                :min="3"
                message="Store state minimum 3 character"
        />
      </DxColumn>
      <DxColumn
              data-field="Employee"
              caption="Employee"
              data-type="string"
              :hiding-priority="3"
              :allow-editing="true"
              :filter-operations="['contains' | 'notcontains' | 'startswith' | 'endswith' | '=' | '<>']"
      >
        <DxRequiredRule/>
      </DxColumn>
      <DxColumn
              data-field="SaleAmount"
              caption="Sale Amount"
              data-type="number"
              format="currency"
              :hiding-priority="6"
              :allow-editing="true"
              :filter-operations="['=', '<>', '<', '>', '<=', '>=', 'between']"
      >
        <DxRequiredRule/>
        <DxNumericRule/>
      </DxColumn>
    </DxDataGrid>
  </div>
</template>

<script>
  /* eslint-disable */
  import "devextreme/data/odata/store";
  import DxDataGrid, {
    DxEditing,
    DxFilterRow,
    DxForm,
    DxLookup,
    DxPopup,
    DxColumn,
    DxRequiredRule,
    DxStringLengthRule,
    DxNumericRule
  } from "devextreme-vue/data-grid";
  import { DxButton } from 'devextreme-vue';
  import {DxItem} from "devextreme-vue/form";
  import CustomStore from 'devextreme/data/custom_store';

  function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== '';
  }

  // error handle for editing table
  // function handleErrors(response) {
  //   if (!response.ok)
  //     throw Error(response.statusText);
  //   return response;
  // }

  // edit data table
  const editTable = {
    editEnabled: true,
    removeEnabled: true,
    inserEnabled: true
  }

  // pagination table options
  const pagingTableOptions = {
    pageSize: 12
  }

  // paget table options
  const pagerTableOptions = {
    showPageSizeSelector: true,
    showNavigationButtons: true,
    showInfo: true,
    allowedPageSizes: [8, 12, 20]
  }

  // group panel tabel options
  const groupPanelTableOptions = {
    visible: true
  }

  const selectionTableOptions = {
    mode: 'multiple'
  }

  export default {
    data() {
      return {
        dataSource: {},
        editTable,
        groupPanelTableOptions,
        pagerTableOptions,
        pagingTableOptions,
        selectionTableOptions,
        selectedDataRow: [],
        dataGridRefName: 'dataGridRefs',
      };
    },
    methods: {
      /**
       * clear selection data row
       */
      clearSelection() {
        const dataGrid = this.$refs[this.dataGridRefName].instance;

        dataGrid.clearSelection();

        // this.initData()
      },
      /**
       * handle selected row data
       * @param {object} select - selected row data
       */
      onSelectionChanged(select) {
        // console.log('selected row: ', select)
        this.selectedDataRow = select.selectedRowsData
      },
      // example log editing
      // https://codesandbox.io/s/nu5qc?file=/App.vue
      onEditingStart(e) {
        console.log('e.key: ', e)
        // ...
      },
      logEvent(e) {
        console.log('log: ', e)
      },
      /**
       * merge column
       * docs: https://js.devexpress.com/Documentation/Guide/Widgets/DataGrid/Columns/Column_Types/Band_Columns/
       * @param columns
       */
      customizeColumns(columns) {
        // columns.push({ // Pushes the "Contacts" band column into the "columns" array
        //   caption: 'Location',
        //   isBand: true
        // });
        //
        // const contactsFields = ['StoreCity', 'StoreState'];
        // for (let i = 0; i < columns.length - 1; i++) {
        //   if (contactsFields.indexOf(columns[i].dataField) > -1) // If the column belongs to "Contacts",
        //     columns[i].ownerBand = columns.length - 1; // assigns "Contacts" as the owner band column
        // }
      },
      initData() {
        // docs custom store:
        // https://js.devexpress.com/Documentation/Guide/Widgets/DataGrid/Data_Binding/Custom_Sources/
        this.dataSource = new CustomStore({
          key: 'OrderNumber',
          load: function (loadOptions) {
            let params = '?';
            [
              'skip',
              'take',
              'requireTotalCount',
              'requireGroupCount',
              'sort',
              'filter',
              'totalSummary',
              'group',
              'groupSummary'
            ].forEach(function (i) {
              if (i in loadOptions && isNotEmpty(loadOptions[i])) {
                params += `${i}=${JSON.stringify(loadOptions[i])}&`;
              }
            });
            params = params.slice(0, -1);
            console.log('isi param display2: ', params)
            // doc fetch
            // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
            return fetch(`https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders${params}`, {
              headers: {
                'headertest': 'header value'
              }
            })
              .then(response => response.json())
              .then((data) => {
                return {
                  data: data.data,
                  totalCount: data.totalCount,
                  summary: data.summary,
                  groupCount: data.groupCount
                };
              })
              .catch(() => {
                throw 'Data Loading Error';
              });
          },
          insert: (values) => {
            // eslint-disable-next-line no-console
            console.log('values insert', values)
            // return fetch("https://mydomain.com/MyDataService", {
            //   method: "POST",
            //   body: JSON.stringify(values),
            //   headers: {
            //     'Content-Type': 'application/json'
            //   }
            // }).then(handleErrors);
          },
          remove: (key) => {
            console.log('key: ', key)
            // return fetch(`https://mydomain.com/MyDataService/${encodeURIComponent(key)}`, {
            //   method: "DELETE"
            // }).then(handleErrors);
          },
          update: (key, values) => {
            console.log('key update: ', key)
            console.log('values update: ', values)
            // return fetch(`https://mydomain.com/MyDataService/${encodeURIComponent(key)}`, {
            //   method: "PUT",
            //   body: JSON.stringify(values),
            //   headers: {
            //     'Content-Type': 'application/json'
            //   }
            // }).then(handleErrors);
          }
        })
      }
    },
    components: {
      DxDataGrid,
      DxFilterRow,
      DxEditing,
      DxPopup,
      DxForm,
      DxItem,
      DxLookup,
      DxColumn,
      DxStringLengthRule,
      DxRequiredRule,
      DxNumericRule,
      DxButton
    },
    created() {
      this.initData()
    }
  };
</script>
