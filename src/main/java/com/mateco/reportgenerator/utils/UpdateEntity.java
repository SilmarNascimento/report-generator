package com.mateco.reportgenerator.utils;

import java.beans.PropertyDescriptor;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

/**
 * Class Utils - It contains methods to help update an object field even with null properties.
 */
public class UpdateEntity {

  /**
   * Static Method - Atualiza todos os atributos não nulos de um objeto numa
   *                 entidade salva no banco de dados.
   */
  public static void copyNonNullProperties(Object source, Object target) {
    BeanUtils.copyProperties(source, target, getNullPropertyName(source));
  }

  /**
   * Static Method - Map an array with the name of all null properties from the object.
   *
   * @param source - objeto recebido com a possibilidade de atributos
   *                 nulos.
   * @return - retorna um array com os atributos da entidade presente
   *           no banco de dados atualizada.
   */
  public static String[] getNullPropertyName(Object source) {
    final BeanWrapper src = new BeanWrapperImpl(source);
    PropertyDescriptor[] pds = src.getPropertyDescriptors();

    Set<String> emptyNames = new HashSet<>();
    System.out.println(emptyNames);
    for (PropertyDescriptor pd : pds) {
      Object srcValue = src.getPropertyValue(pd.getName());
      if (srcValue == null) {
        emptyNames.add(pd.getName());
      }
    }

    String[] result = new String[emptyNames.size()];
    return emptyNames.toArray(result);
  }
}

