package com.company.projectmanager.app;

import com.company.projectmanager.entity.ProjectStats;

import java.util.List;

public interface ProjectStatsService {
    List<ProjectStats> fetchProjectStatistics();
}
