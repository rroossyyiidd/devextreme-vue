<template>
  <div>
    <h2 class="content-block">Display Data Custom</h2>

    <!--:data-source="dataSourceConfig"-->
    <dx-data-grid
      class="dx-card wide-card"
      :data-source="dataSourceConfig"
      :focused-row-index="0"
      :show-borders="false"
      :focused-row-enabled="true"
      :column-auto-width="true"
      :column-hiding-enabled="true"
      key-expr="Task_ID"
      ref="myDataGridCustom"
    >
      <dx-paging
              :page-size.sync="pageSize"
              :page-index.sync="pageIndex"
      />
      <dx-pager
              :allowed-page-sizes="[10, 20, 50]"
              :show-navigation-buttons="true"
              :show-page-size-selector="true"
              :show-info="true" />
      <dx-filter-row :visible="true" />

      <dx-column data-field="Task_ID" :width="90" :hiding-priority="2" />

      <dx-column
        data-field="Task_Subject"
        caption="Subject"
        :width="190"
        :hiding-priority="7"
        :filter-value.sync="filterValue"
      />

      <dx-column
        data-field="Task_Status"
        caption="Status"
        :hiding-priority="6"
      />

      <dx-column
        data-field="Task_Priority"
        caption="Priority"
        :hiding-priority="5"
      >
        <dx-lookup
          display-expr="name"
          value-expr="value"
          :data-source="priorities"
        />
      </dx-column>

      <!--<dx-column-->
      <!--  data-field="ResponsibleEmployee.Employee_Full_Name"-->
      <!--  caption="Assigned To"-->
      <!--  :allow-sorting="false"-->
      <!--  :hiding-priority="7"-->
      <!--/>-->

      <dx-column
        data-field="Task_Start_Date"
        caption="Start Date"
        data-type="date"
        :hiding-priority="3"
      />

      <dx-column
        data-field="Task_Due_Date"
        caption="Due Date"
        data-type="date"
        :hiding-priority="4"
      />

      <dx-column
        data-field="Task_Priority"
        caption="Priority"
        :hiding-priority="1"
      />

      <dx-column
        data-field="Task_Completion"
        caption="Completion"
        :hiding-priority="0"
      />
    </dx-data-grid>
  </div>
</template>

<script>
import "devextreme/data/odata/store";
import {datas} from "./dataTable";
import DxDataGrid, {
  DxColumn,
  DxFilterRow,
  DxLookup,
  DxPager,
  DxPaging
} from "devextreme-vue/data-grid";
import CustomStore from 'devextreme/data/custom_store';

const priorities = [
  { name: "High", value: 4 },
  { name: "Urgent", value: 3 },
  { name: "Normal", value: 2 },
  { name: "Low", value: 1 }
];

export default {
  data() {
    return {
      priorities,
      dataSource: datas,
      allowedOperations: ['contains', '='],
      selectedOperation: 'contains',
      filterValue: '', // filter value column
      pageIndex: 0, // selected page
      pageSize: 10 // data per page
    };
  },
  methods: {
    applyFilter (operation, value) {
      // eslint-disable-next-line no-console
      console.log('operation: ', operation)
      // eslint-disable-next-line no-console
      console.log('value: ', value)
      this.selectedOperation = operation;
      this.filterValue = value;
    },
    changePageSize(value) {
      console.log('change pageSize: ', value)
      this.pageSize = value;
    },
    goToLastPage() {
      const pageCount = this.$refs['myDataGridCustom'].instance.pageCount();
      console.log('page count: ', pageCount)
      this.pageIndex = pageCount - 1;
    },
    getTotalPageCount() {
      return this.$refs['myDataGridCustom'].instance.pageCount();
    }
  },
  created() {
    const store = new CustomStore({
      key: "Task_ID",
    })

    this.dataSourceConfig = {
      store: {
        type: "odata",
        key: "Task_ID",
        // dataSource: datas
        url: "https://js.devexpress.com/Demos/DevAV/odata/Tasks"
      },
      // key: "Task_ID",
      // dataSource: datas,
      expand: "ResponsibleEmployee",
      select: [
        "Task_ID",
        "Task_Subject",
        "Task_Start_Date",
        "Task_Due_Date",
        "Task_Status",
        "Task_Priority",
        "Task_Completion",
        "ResponsibleEmployee/Employee_Full_Name"
      ]
    };
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxFilterRow,
    DxLookup,
    DxPager,
    DxPaging
  },
  watch: {
    'filterValue': function (value) {
      console.log('value watch: ', value)
      console.log('selectedOperation: ', this.selectedOperation)
    },
    'pageIndex': function (value) {
      console.log('pageIndex watch: ', value)
    }
  }
};
</script>
