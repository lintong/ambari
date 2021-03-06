/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. The ASF
 * licenses this file to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

var App = require('app');

/**
 * @class
 * 
 * This is a view for showing cluster CPU metrics
 * 
 * @extends App.ChartLinearTimeView
 * @extends Ember.Object
 * @extends Ember.View
 */
App.ChartServiceMetricsMapReduce_JVMHeap = App.ChartLinearTimeView.extend({
  id: "service-metrics-mapreduce-jvm-heap",
  title: "JVM Memory Status",
  yAxisFormatter: App.ChartLinearTimeView.BytesFormatter,
  renderer: 'line',
  url: function () {
    var mrService = App.MapReduceService.find().objectAt(0);
    var jtHostName = mrService.get('jobTracker').get('hostName');
    return App.formatUrl(App.apiPrefix + "/clusters/{clusterName}/hosts/{hostName}/host_components/JOBTRACKER?fields=metrics/jvm/memNonHeapUsedM[{fromSeconds},{toSeconds},{stepSeconds}],metrics/jvm/memNonHeapCommittedM[{fromSeconds},{toSeconds},{stepSeconds}],metrics/jvm/memHeapUsedM[{fromSeconds},{toSeconds},{stepSeconds}],metrics/jvm/memHeapCommittedM[{fromSeconds},{toSeconds},{stepSeconds}]", {
      clusterName: App.router.get('clusterController.clusterName'),
      hostName: jtHostName
    }, "/data/services/metrics/mapreduce/jvm_heap.json");
  }.property('App.router.clusterController.clusterName'),

  transformToSeries: function (jsonData) {
    var seriesArray = [];
    if (jsonData && jsonData.metrics && jsonData.metrics.jvm) {
      for ( var name in jsonData.metrics.jvm) {
        var displayName;
        var seriesData = jsonData.metrics.jvm[name];
        switch (name) {
          case "memHeapCommittedM":
            displayName = "Heap Memory Committed";
            break;
          case "memNonHeapUsedM":
            displayName = "Non Heap Memory Used";
            break;
          case "memHeapUsedM":
            displayName = "Heap Memory Used";
            break;
          case "memNonHeapCommittedM":
            displayName = "Non Heap Memory Committed";
            break;
          default:
            break;
        }
        if (seriesData) {
          // Is it a string?
          if ("string" == typeof seriesData) {
            seriesData = JSON.parse(seriesData);
          }
          // We have valid data
          var series = {};
          series.name = displayName;
          series.data = [];
          for ( var index = 0; index < seriesData.length; index++) {
            series.data.push({
              x: seriesData[index][1],
              y: seriesData[index][0] * 1000000
            // Data is in MB
            });
          }
          seriesArray.push(series);
        }
      }
    }
    return seriesArray;
  }
});