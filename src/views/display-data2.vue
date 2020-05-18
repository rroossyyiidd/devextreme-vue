<template>
  <div>
    <h2 class="content-block">Display Data Custom</h2>

    <DxDataGrid
            :data-source="dataSource"
            :show-borders="true"
            :columns="columnsTable"
            :column-auto-width="true"
            :column-hiding-enabled="true"
            :selection="{mode: 'multiple'}"
            @selection-changed="onSelectionChanged"
    >
      <dx-filter-row :visible="true"/>
      <DxPaging :page-size="12"/>
      <DxPager
              :show-page-size-selector="true"
              :show-navigation-buttons="true"
              :show-info="true"
              :allowed-page-sizes="[8, 12, 20]"
      />
    </DxDataGrid>
  </div>
</template>

<script>
  import "devextreme/data/odata/store";
  import DxDataGrid, {
    DxColumn,
    DxFilterRow,
    DxLookup,
    DxPager,
    DxPaging
  } from "devextreme-vue/data-grid";
  import CustomStore from 'devextreme/data/custom_store';

  function isNotEmpty(value) {
    return value !== undefined && value !== null && value !== '';
  }

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
    }
  });

  // column table
  const columnsTable = [
    {
      dataField: 'OrderNumber', // data field
      headerCellTemplate: 'No Order', // title header column
      dataType: 'number', // type data column
      hidingPriority: 5, // hiding priority column when small screen, optional
      width: 100 // width column, optional
    },
    {
      dataField: 'OrderDate',
      headerCellTemplate: 'Order Date',
      dataType: 'date',
      hidingPriority: 4
    },
    {
      dataField: 'StoreCity',
      headerCellTemplate: 'Store City',
      dataType: 'string',
      hidingPriority: 2
    },
    {
      dataField: 'StoreState',
      headerCellTemplate: 'Store State',
      dataType: 'string',
      hidingPriority: 1
    },
    {
      dataField: 'Employee',
      headerCellTemplate: 'Employee',
      dataType: 'string',
      hidingPriority: 3
    },
    {
      dataField: 'SaleAmount',
      headerCellTemplate: 'Sale Amount',
      dataType: 'number',
      format: 'currency',
      hidingPriority: 6
    }
  ]

  export default {
    data() {
      return {
        dataSource: store,
        columnsTable,
        allowedOperations: ['contains', '='],
        selectedOperation: 'contains'
      };
    },
    methods: {
      /**
       * handle selected row data
       * @param {object} select - selected row data
       */
      onSelectionChanged(select) {
        console.log('selected row: ', select)
      }
    },
    created() {},
    components: {
      DxDataGrid,
      DxColumn,
      DxFilterRow,
      DxLookup,
      DxPager,
      DxPaging
    }
  };
</script>
