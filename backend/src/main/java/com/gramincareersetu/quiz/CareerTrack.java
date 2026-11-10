package com.gramincareersetu.quiz;

/**
 * Strongly typed enumeration representing primary career recommendation tracks.
 * Eliminates magic strings across quiz scoring and track recommendations.
 */
public enum CareerTrack {
    GOVERNMENT("government", "Government & Public Sector"),
    TECHNICAL_ITI("iti", "Technical & ITI"),
    VOCATIONAL_BPO("bpo", "Vocational & BPO Services"),
    BUSINESS_ENTREPRENEUR("business", "Rural Business & Entrepreneurship");

    private final String code;
    private final String label;

    CareerTrack(String code, String label) {
        this.code = code;
        this.label = label;
    }

    public String getCode() {
        return code;
    }

    public String getLabel() {
        return label;
    }

    public static CareerTrack fromCode(String code) {
        if (code == null || code.isBlank()) {
            return GOVERNMENT;
        }
        for (CareerTrack track : values()) {
            if (track.code.equalsIgnoreCase(code.trim())) {
                return track;
            }
        }
        return GOVERNMENT;
    }
}
