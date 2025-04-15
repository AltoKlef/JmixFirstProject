package com.company.projectmanager.app;

import com.company.projectmanager.entity.Project;
import com.company.projectmanager.entity.ProjectStats;
import com.company.projectmanager.entity.Task;
import io.jmix.core.DataManager;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class ProjectStatsService {
    private final DataManager dataManager;

    public ProjectStatsService(DataManager dataManager) {
        this.dataManager = dataManager;
    }

    public List<ProjectStats> fetchProjectStatistics(){
        List<Project> projects= dataManager.load(Project.class).all().list();
        List<ProjectStats> projectStats = projects.stream().map(project -> {
            ProjectStats stat = dataManager.create(ProjectStats.class);
            stat.setId(project.getId());
            stat.setProjectName(project.getName());
            stat.setTasksCount(project.getTasks().size());
            Integer plannedEfforts = project.getTasks().stream().map(Task::getEstimation).reduce(0, Integer::sum);
            stat.setPlannedEfforts(plannedEfforts);
            stat.setActualEfforts(getActualEfforts(project.getId()));
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