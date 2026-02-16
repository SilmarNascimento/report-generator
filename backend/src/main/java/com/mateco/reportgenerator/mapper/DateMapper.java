package com.mateco.reportgenerator.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;

@Component
public class DateMapper {

    private final ZoneId zoneId;

    public DateMapper(@Value("${app.timezone:UTC}") String timezone) {
        this.zoneId = ZoneId.of(timezone);
    }

    public Instant map(OffsetDateTime value) {
        return value == null ? null : value.toInstant();
    }

    public OffsetDateTime map(Instant value) {
        return value == null ? null : value.atZone(zoneId).toOffsetDateTime();
    }
}