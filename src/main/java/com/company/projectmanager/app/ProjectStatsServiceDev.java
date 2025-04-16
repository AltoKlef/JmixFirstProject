package com.company.projectmanager.app;

import com.company.projectmanager.entity.Project;
import com.company.projectmanager.entity.ProjectStats;
import com.company.projectmanager.entity.Task;
import io.jmix.core.DataManager;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Primary
@Profile("dev")
@Component
public class ProjectStatsServiceDev implements ProjectStatsService {
    private final DataManager dataManager;

    public ProjectStatsServiceDev(DataManager dataManager) {
        this.dataManager = dataManager;
    }

    @Override
    public List<ProjectStats> fetchProjectStatistics(){
        List<Project> projects= dataManager.load(Project.class).all().list();
        List<ProjectStats> projectStats = projects.stream().map(project -> {
            ProjectStats stat = dataManager.create(ProjectStats.class);
            stat.setId(project.getId());
            stat.setProjectName(project.getName());
            stat.setTasksCount(project.getTasks().size());
            Integer plannedEfforts = project.getTasks().stream().map(Task::getEstimation).reduce(0, Integer::sum);
            Integer actualEfforts = getActualEfforts(project.getId());
            actualEfforts = actualEfforts != null ? actualEfforts : 0;
            stat.setPlannedEfforts(plannedEfforts);
            stat.setActualEfforts(actualEfforts);
            stat.setDifference(plannedEfforts-actualEfforts);
            return stat;
        }).collect(Collectors.toList());
        return projectStats;

    }
    public Integer getActualEfforts(UUID projectId){
        return dataManager.loadValue("select SUM(t.timeSpent) from TimeEntry t " +
                "where t.task.project.id = :projectId", Integer.class)
                .parameter("projectId", projectId)
                .one();

    }
}