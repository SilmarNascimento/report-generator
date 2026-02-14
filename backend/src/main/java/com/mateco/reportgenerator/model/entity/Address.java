package com.mateco.reportgenerator.model.entity;

import com.mateco.reportgenerator.enums.UF;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Address implements Serializable {

    private String street;

    @Column(length = 20)
    private String number;

    private String complement;

    private String neighborhood;

    private String city;

    @Enumerated(EnumType.STRING)
    @Column(length = 2)
    private UF state;

    @Column(length = 8)
    private String zipCode;
}