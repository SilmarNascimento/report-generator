package com.mateco.reportgenerator.controller.dto.jasperReportDto;

public record QuestionDetailDTO(
        Integer id,
        String level,
        String officialAnswer,
        String studentAnswer,
        String status,
        String subject
) {
    public Integer getId()            { return id; }
    public String getLevel()          { return level; }
    public String getOfficialAnswer() { return officialAnswer; }
    public String getStudentAnswer()  { return studentAnswer; }
    public String getStatus()         { return status; }
    public String getSubject()        { return subject; }
}