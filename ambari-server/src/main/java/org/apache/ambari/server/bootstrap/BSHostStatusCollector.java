/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.ambari.server.bootstrap;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Runnable class that gets the hoststatus output by looking at the files
 * in a certain directory. Only meant to be useful for bootstrap as of now.
 */
class BSHostStatusCollector {
  private File requestIdDir;
  private List<BSHostStatus> hostStatus;
  static String logFileFilter = ".log";
  static String doneFileFilter = ".done";
  private static Log LOG = LogFactory.getLog(BSHostStatusCollector.class);

  private List<String> hosts;

  public BSHostStatusCollector(File requestIdDir, List<String> hosts) {
    this.requestIdDir = requestIdDir;
    this.hosts = hosts;
  }

  public List<BSHostStatus> getHostStatus() {
    return hostStatus;
  }

  public void run() {
    LOG.info("Request directory " + requestIdDir);
    hostStatus = new ArrayList<BSHostStatus>();
    if (hosts == null) {
      return;
    }
    File done;
    File log;
    LOG.info("HostList for polling on " + hosts);
    for (String host: hosts) {
      /* Read through the files and gather output */
      BSHostStatus status = new BSHostStatus();
      status.setHostName(host);
      done = new File(requestIdDir, host + doneFileFilter);
      log = new File(requestIdDir, host + logFileFilter);
      if (!done.exists())
        status.setStatus("RUNNING");
      else
        status.setStatus("DONE");
      if (!log.exists()) {
        status.setLog("");
      } else {
        String logString = "";
        try {
          logString = FileUtils.readFileToString(log);
        } catch (IOException e) {
          LOG.info("Error reading log file " + log);
        }
        status.setLog(logString);
      }
      hostStatus.add(status);
    }
  }
}
