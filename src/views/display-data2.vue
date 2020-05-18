<template>
  <div>
    <h2 class="content-block">Display Data Custom</h2>

    <DxDataGrid
            :data-source="dataSource"
            :show-borders="true"
            :columns="columnsTable"
            :column-auto-width="true"
            :column-hiding-enabled="true"
            :selection="selectionTableOptions"
            :group-panel="groupPanelTableOptions"
            :editing="editTable"
            @selection-changed="onSelectionChanged"
            :customize-columns="customizeColumns"
            :paging="pagingTableOptions"
            :pager="pagerTableOptions"
    >
      <!--filter data table-->
      <dx-filter-row :visible="true"/>
      <!--edit data table-->
      <DxEditing
              mode="popup"
              :allow-updating="true"
              :allow-deleting="true"
              :confirm-delete="true"
              :allow-adding="true"
      >
        <DxPopup
                :show-title="true"
                title="Edit data"
        />
      </DxEditing>
    </DxDataGrid>
  </div>
</template>

<script>
  import "devextreme/data/odata/store";
  import DxDataGrid, {
    DxFilterRow,
    DxEditing,
    DxPopup,
    DxForm,
    DxFormItem
  } from "devextreme-vue/data-grid";
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

  // docs custom store:
  // https://js.devexpress.com/Documentation/Guide/Widgets/DataGrid/Data_Binding/Custom_Sources/
  const store = new CustomStore({
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
      // console.log('isi param: ', params)
      return fetch(`https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders${params}`)
        .then(response => response.json())
        .then((data) => {
          // console.log('data respnse: ', data)
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
  });

  // edit data table
  const editTable = {
    editEnabled: true,
    removeEnabled: true,
    inserEnabled: true
  }

  // column table
  const columnsTable = [
    {
      dataField: 'OrderNumber', // data field
      headerCellTemplate: 'No Order', // title header column
      dataType: 'number', // type data column
      hidingPriority: 5, // hiding priority column when small screen, optional
      width: 100, // width column, optional
      allowEditing: false, // allow editing data?
      filterOperations: ["=", "<>", "<", ">", "<=", ">=", "between"] // filter operations (default)
    },
    {
      dataField: 'OrderDate',
      headerCellTemplate: 'Order Date',
      dataType: 'date',
      hidingPriority: 4,
      allowEditing: true
    },
    {
      dataField: 'StoreCity',
      headerCellTemplate: 'Store City',
      dataType: 'string',
      hidingPriority: 2,
      allowEditing: true,
      filterOperations: ["="]
    },
    {
      dataField: 'StoreState',
      headerCellTemplate: 'Store State',
      dataType: 'string',
      hidingPriority: 1,
      allowEditing: true
    },
    {
      dataField: 'Employee',
      headerCellTemplate: 'Employee',
      dataType: 'string',
      hidingPriority: 3,
      allowEditing: true
    },
    {
      dataField: 'SaleAmount',
      headerCellTemplate: 'Sale Amount',
      dataType: 'number',
      format: 'currency',
      hidingPriority: 6,
      allowEditing: true
    }
  ]

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
        dataSource: store,
        columnsTable,
        editTable,
        groupPanelTableOptions,
        pagerTableOptions,
        pagingTableOptions,
        selectionTableOptions
      };
    },
    methods: {
      /**
       * handle selected row data
       * @param {object} select - selected row data
       */
      onSelectionChanged(select) {
        console.log('selected row: ', select)
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
      }
    },
    components: {
      DxDataGrid,
      DxFilterRow,
      DxEditing,
      DxPopup,
      DxFormItem,
      DxForm
    }
  };
</script>
