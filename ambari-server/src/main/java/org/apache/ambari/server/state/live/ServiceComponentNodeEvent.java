package org.apache.ambari.server.state.live;

import org.apache.ambari.server.fsm.event.AbstractEvent;

public class ServiceComponentNodeEvent
    extends AbstractEvent<ServiceComponentNodeEventType> {

  public ServiceComponentNodeEvent(ServiceComponentNodeEventType type) {
    super(type);
    // TODO Auto-generated constructor stub
  }

}