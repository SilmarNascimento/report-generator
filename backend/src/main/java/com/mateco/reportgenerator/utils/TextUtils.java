package com.mateco.reportgenerator.utils;

import java.text.Normalizer;
import java.util.regex.Pattern;

public final class TextUtils {

    private static final Pattern DIACRITICS_PATTERN = Pattern.compile("\\p{M}+");

    private TextUtils() {
    }

    public static String normalize(String text) {
        if (text == null) {
            return "";
        }

        String decomposed = Normalizer.normalize(text, Normalizer.Form.NFD);
        String withoutDiacritics = DIACRITICS_PATTERN.matcher(decomposed).replaceAll("");

        return withoutDiacritics.toLowerCase().trim();
    }
}
