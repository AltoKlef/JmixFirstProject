package com.company.projectmanager.view.timeentry;

import java.time.LocalDate;
import com.company.projectmanager.entity.TaskPriority;
import com.company.projectmanager.entity.TimeEntry;
import com.company.projectmanager.view.main.MainView;
import com.vaadin.flow.router.Route;
import io.jmix.core.TimeSource;
import io.jmix.flowui.view.*;
import org.springframework.beans.factory.annotation.Autowired;

@Route(value = "time-entries/:id", layout = MainView.class)
@ViewController(id = "TimeEntry.detail")
@ViewDescriptor(path = "time-entry-detail-view.xml")
@EditedEntityContainer("timeEntryDc")
public class TimeEntryDetailView extends StandardDetailView<TimeEntry> {
    @Autowired
    private TimeSource timeSource;

    @Subscribe
    public void onInitEntity(final InitEntityEvent<TimeEntry> event) {
        event.getEntity().setEntryDate(timeSource.now().toLocalDateTime());
    }
}