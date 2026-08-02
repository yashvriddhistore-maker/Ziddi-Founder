/**
 * panchang.js - Astronomical Calculation Engine for Spiritual Utility Platform
 * Author: Antigravity Team
 * 
 * Provides client-side calculations for:
 * 1. Sunrise & Sunset (based on Latitude, Longitude, and Date)
 * 2. Rahu Kaal (computed dynamically from Sunrise/Sunset and Weekday)
 * 3. Choghadiya (Day and Night divisions based on Weekday)
 * 4. Approximate Tithi (Lunar Phase calculation)
 */

const PanchangEngine = {
    // Default coordinates: New Delhi, India
    DEFAULT_COORDS: { lat: 28.6139, lng: 77.2090, name: "New Delhi" },

    CITIES: [
        { name: "New Delhi", lat: 28.6139, lng: 77.2090 },
        { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
        { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
        { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
        { name: "Varanasi", lat: 25.3176, lng: 82.9739 },
        { name: "Haridwar", lat: 29.9457, lng: 78.1642 },
        { name: "Ayodhya", lat: 26.7956, lng: 82.1943 },
        { name: "Ujjain", lat: 23.1760, lng: 75.7885 },
        { name: "Chennai", lat: 13.0827, lng: 80.2707 },
        { name: "Hyderabad", lat: 17.3850, lng: 78.4867 }
    ],

    // Convert degrees to radians
    rad: (deg) => deg * Math.PI / 180,
    // Convert radians to degrees
    deg: (rad) => rad * 180 / Math.PI,

    /**
     * Compute Sunrise and Sunset times using standard solar calculations
     * Ref: NOAA Solar Calculator algorithms
     * Returns fractional hours (local time)
     */
    calculateSunriseSunset: function(date, lat, lng, timezoneOffsetHours = 5.5) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        // 1. Calculate the day of the year
        const N1 = Math.floor(275 * month / 9);
        const N2 = Math.floor((month + 9) / 12);
        const N3 = (1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3));
        const N = N1 - (N2 * N3) + day - 30;

        // 2. Convert longitude to hour value and estimate half days
        const lngHour = lng / 15;
        const t_rise = N + ((6 - lngHour) / 24);
        const t_set = N + ((18 - lngHour) / 24);

        // 3. Calculate Sun's mean anomaly
        const M_rise = (0.9856 * t_rise) - 3.289;
        const M_set = (0.9856 * t_set) - 3.289;

        // 4. Calculate Sun's true longitude
        const getTrueLong = (M) => {
            let L = M + (1.916 * Math.sin(this.rad(M))) + (0.020 * Math.sin(this.rad(2 * M))) + 282.634;
            // Adjust L to [0, 360)
            L = (L + 360) % 360;
            return L;
        };
        const L_rise = getTrueLong(M_rise);
        const L_set = getTrueLong(M_set);

        // 5. Calculate Sun's right ascension
        const getRA = (L) => {
            let RA = this.deg(Math.atan(0.91764 * Math.tan(this.rad(L))));
            RA = (RA + 360) % 360;
            // Adjust RA quadrant
            const Lquadrant = Math.floor(L / 90) * 90;
            const RAquadrant = Math.floor(RA / 90) * 90;
            RA = RA + (Lquadrant - RAquadrant);
            RA = RA / 15; // convert to hours
            return RA;
        };
        const RA_rise = getRA(L_rise);
        const RA_set = getRA(L_set);

        // 6. Calculate Sun's declination
        const getDec = (L) => {
            const sinDec = 0.39782 * Math.sin(this.rad(L));
            const cosDec = Math.cos(Math.asin(sinDec));
            return { sinDec, cosDec };
        };
        const dec_rise = getDec(L_rise);
        const dec_set = getDec(L_set);

        // 7. Calculate Sun's local hour angle
        // Zenith for sunrise/sunset is 90 degrees 50 minutes (approx 90.833 degrees)
        const zenith = 90.833;
        const cosZenith = Math.cos(this.rad(zenith));

        const getLocalHourAngle = (dec, isRise) => {
            const cosH = (cosZenith - (dec.sinDec * Math.sin(this.rad(lat)))) / (dec.cosDec * Math.cos(this.rad(lat)));
            if (cosH > 1) return null;  // Sun never rises
            if (cosH < -1) return null; // Sun never sets
            
            const H = isRise ? 360 - this.deg(Math.acos(cosH)) : this.deg(Math.acos(cosH));
            return H / 15; // convert to hours
        };

        const H_rise = getLocalHourAngle(dec_rise, true);
        const H_set = getLocalHourAngle(dec_set, false);

        if (H_rise === null || H_set === null) {
            // Polar regions fallback
            return { sunrise: "06:00", sunset: "18:00", sunriseSec: 21600, sunsetSec: 64800 };
        }

        // 8. Calculate local mean time of rising/setting
        const T_rise = H_rise + RA_rise - (0.06571 * t_rise) - 6.622;
        const T_set = H_set + RA_set - (0.06571 * t_set) - 6.622;

        // 9. Adjust back to UTC
        const UT_rise = (T_rise - lngHour + 24) % 24;
        const UT_set = (T_set - lngHour + 24) % 24;

        // 10. Convert to local time zone (IST default is +5.5)
        const localRise = (UT_rise + timezoneOffsetHours + 24) % 24;
        const localSet = (UT_set + timezoneOffsetHours + 24) % 24;

        const formatTime = (fractionalHours) => {
            const hours = Math.floor(fractionalHours);
            const minutes = Math.floor((fractionalHours - hours) * 60);
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        };

        return {
            sunrise: formatTime(localRise),
            sunset: formatTime(localSet),
            sunriseDecimal: localRise,
            sunsetDecimal: localSet,
            sunriseSec: Math.floor(localRise * 3600),
            sunsetSec: Math.floor(localSet * 3600)
        };
    },

    /**
     * Compute Rahu Kaal timing for the day
     * Rahu Kaal occurs during a specific octant of the daylight period
     */
    calculateRahuKaal: function(sunriseDecimal, sunsetDecimal, weekdayIndex) {
        // Weekday index: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        // Octant mapping (1-indexed) based on weekday
        const octantMap = {
            0: 8, // Sunday: 8th octant
            1: 2, // Monday: 2nd octant
            2: 7, // Tuesday: 7th octant
            3: 5, // Wednesday: 5th octant
            4: 6, // Thursday: 6th octant
            5: 4, // Friday: 4th octant
            6: 3  // Saturday: 3th octant
        };

        const targetOctant = octantMap[weekdayIndex];
        const dayLength = sunsetDecimal - sunriseDecimal;
        const octantLength = dayLength / 8;

        const startDecimal = sunriseDecimal + (targetOctant - 1) * octantLength;
        const endDecimal = sunriseDecimal + targetOctant * octantLength;

        const formatDecimalTime = (decimalHours) => {
            const hours = Math.floor(decimalHours);
            const minutes = Math.floor((decimalHours - hours) * 60);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 === 0 ? 12 : hours % 12;
            return `${displayHours}:${String(minutes).padStart(2, '0')} ${ampm}`;
        };

        return {
            start: formatDecimalTime(startDecimal),
            end: formatDecimalTime(endDecimal),
            startDecimal: startDecimal,
            endDecimal: endDecimal
        };
    },

    /**
     * Compute Choghadiya divisions for the day and night
     */
    getChoghadiyaList: function(sunriseDecimal, sunsetDecimal, weekdayIndex) {
        // Choghadiya types and their auspiciousness
        const TYPES = {
            AMRIT: { name: "Amrit (अमृत)", status: "auspicious", desc: "Best for all auspicious works, prayers, and travel." },
            SHUBH: { name: "Shubh (शुभ)", status: "auspicious", desc: "Excellent for planning, transactions, and ceremonies." },
            LABH: { name: "Labh (लाभ)", status: "auspicious", desc: "Beneficial for business operations, education, and starting deals." },
            CHAL: { name: "Chal (चल)", status: "neutral", desc: "Neutral. Normal operations, travel, and routine tasks." },
            UDVEG: { name: "Udveg (उद्वेग)", status: "inauspicious", desc: "Inauspicious. Avoid initial agreements or key investments." },
            KAAL: { name: "Kaal (काल)", status: "inauspicious", desc: "Inauspicious. Best to avoid important business or travel." },
            ROG: { name: "Rog (रोग)", status: "inauspicious", desc: "Inauspicious. Avoid healthcare procedures or major assets purchase." }
        };

        // Day Choghadiya sequence by weekday (0 = Sunday, 1 = Monday...)
        const daySequence = {
            0: [TYPES.UDVEG, TYPES.CHAL, TYPES.LABH, TYPES.AMRIT, TYPES.KAAL, TYPES.SHUBH, TYPES.ROG, TYPES.UDVEG], // Sun
            1: [TYPES.AMRIT, TYPES.KAAL, TYPES.SHUBH, TYPES.ROG, TYPES.UDVEG, TYPES.CHAL, TYPES.LABH, TYPES.AMRIT], // Mon
            2: [TYPES.ROG, TYPES.UDVEG, TYPES.CHAL, TYPES.LABH, TYPES.AMRIT, TYPES.KAAL, TYPES.SHUBH, TYPES.ROG],   // Tue
            3: [TYPES.LABH, TYPES.AMRIT, TYPES.KAAL, TYPES.SHUBH, TYPES.ROG, TYPES.UDVEG, TYPES.CHAL, TYPES.LABH],  // Wed
            4: [TYPES.SHUBH, TYPES.ROG, TYPES.UDVEG, TYPES.CHAL, TYPES.LABH, TYPES.AMRIT, TYPES.KAAL, TYPES.SHUBH], // Thu
            5: [TYPES.CHAL, TYPES.LABH, TYPES.AMRIT, TYPES.KAAL, TYPES.SHUBH, TYPES.ROG, TYPES.UDVEG, TYPES.CHAL],  // Fri
            6: [TYPES.KAAL, TYPES.SHUBH, TYPES.ROG, TYPES.UDVEG, TYPES.CHAL, TYPES.LABH, TYPES.AMRIT, TYPES.KAAL]   // Sat
        };

        // Night Choghadiya sequence by weekday (starts after Sunset)
        const nightSequence = {
            0: [TYPES.AMRIT, TYPES.KAAL, TYPES.SHUBH, TYPES.ROG, TYPES.UDVEG, TYPES.CHAL, TYPES.LABH, TYPES.AMRIT], // Sun Night
            1: [TYPES.CHAL, TYPES.LABH, TYPES.AMRIT, TYPES.KAAL, TYPES.SHUBH, TYPES.ROG, TYPES.UDVEG, TYPES.CHAL],  // Mon Night
            2: [TYPES.KAAL, TYPES.SHUBH, TYPES.ROG, TYPES.UDVEG, TYPES.CHAL, TYPES.LABH, TYPES.AMRIT, TYPES.KAAL],   // Tue Night
            3: [TYPES.UDVEG, TYPES.CHAL, TYPES.LABH, TYPES.AMRIT, TYPES.KAAL, TYPES.SHUBH, TYPES.ROG, TYPES.UDVEG], // Wed Night
            4: [TYPES.AMRIT, TYPES.KAAL, TYPES.SHUBH, TYPES.ROG, TYPES.UDVEG, TYPES.CHAL, TYPES.LABH, TYPES.AMRIT], // Thu Night
            5: [TYPES.ROG, TYPES.UDVEG, TYPES.CHAL, TYPES.LABH, TYPES.AMRIT, TYPES.KAAL, TYPES.SHUBH, TYPES.ROG],   // Fri Night
            6: [TYPES.LABH, TYPES.AMRIT, TYPES.KAAL, TYPES.SHUBH, TYPES.ROG, TYPES.UDVEG, TYPES.CHAL, TYPES.LABH]   // Sat Night
        };

        const dayLength = sunsetDecimal - sunriseDecimal;
        const dayInterval = dayLength / 8;

        const nightLength = (24 - sunsetDecimal) + sunriseDecimal;
        const nightInterval = nightLength / 8;

        const list = [];
        const formatDecimalTime = (decimalHours) => {
            const adjustedHours = (decimalHours + 24) % 24;
            const hours = Math.floor(adjustedHours);
            const minutes = Math.floor((adjustedHours - hours) * 60);
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        };

        // Populate Day Choghadiyas
        const dayList = daySequence[weekdayIndex];
        for (let i = 0; i < 8; i++) {
            const start = sunriseDecimal + i * dayInterval;
            const end = sunriseDecimal + (i + 1) * dayInterval;
            list.push({
                index: i + 1,
                name: dayList[i].name,
                status: dayList[i].status,
                desc: dayList[i].desc,
                isNight: false,
                start: formatDecimalTime(start),
                end: formatDecimalTime(end),
                startDecimal: start,
                endDecimal: end
            });
        }

        // Populate Night Choghadiyas
        const nightList = nightSequence[weekdayIndex];
        for (let i = 0; i < 8; i++) {
            const start = sunsetDecimal + i * nightInterval;
            const end = sunsetDecimal + (i + 1) * nightInterval;
            list.push({
                index: i + 9,
                name: nightList[i].name,
                status: nightList[i].status,
                desc: nightList[i].desc,
                isNight: true,
                start: formatDecimalTime(start),
                end: formatDecimalTime(end),
                startDecimal: start % 24,
                endDecimal: end % 24
            });
        }

        return list;
    },

    /**
     * Compute approximate Lunar Tithi (1 to 30) based on Astronomical Moon position
     * Leverages simplified lunar phase cycle calculation.
     */
    calculateLunarTithi: function(date) {
        // Known base new moon: 1970-01-07 19:35 UTC
        const baseDate = new Date(Date.UTC(1970, 0, 7, 19, 35, 0));
        const diffMs = date.getTime() - baseDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        
        // Average synodic month (lunar cycle) is 29.530588853 days
        const synodicMonth = 29.530588853;
        const cycles = diffDays / synodicMonth;
        const currentAge = (cycles - Math.floor(cycles)) * synodicMonth;

        // Devide 29.53 days into 30 tithis (approx 0.9843 days each tithi)
        const tithiDecimal = (currentAge / synodicMonth) * 30;
        let tithiNum = Math.floor(tithiDecimal) + 1;
        if (tithiNum > 30) tithiNum = 30;

        const TITHIS_HINDI = {
            1: "Pratipada (प्रतिपदा)",
            2: "Dwitiya (द्वितीया)",
            3: "Tritiya (तृतीया)",
            4: "Chaturthi (चतुर्थी)",
            5: "Panchami (पंचमी)",
            6: "Shashthi (षष्ठी)",
            7: "Saptami (सप्तमी)",
            8: "Ashtami (अष्टमी)",
            9: "Navami (नवमी)",
            10: "Dashami (दशमी)",
            11: "Ekadashi (एकादशी)",
            12: "Dwadashi (द्वादशी)",
            13: "Trayodashi (त्रयोदशी)",
            14: "Chaturdashi (चतुर्दशी)",
            15: "Purnima (पूर्णिमा) - Full Moon",
            16: "Pratipada (प्रतिपदा)",
            17: "Dwitiya (द्वितीया)",
            18: "Tritiya (तृतीया)",
            19: "Chaturthi (चतुर्थी)",
            20: "Panchami (पंचमी)",
            21: "Shashthi (षष्ठी)",
            22: "Saptami (सप्तमी)",
            23: "Ashtami (अष्टमी)",
            24: "Navami (नवमी)",
            25: "Dashami (दशमी)",
            26: "Ekadashi (एकादशी)",
            27: "Dwadashi (द्वादशी)",
            28: "Trayodashi (त्रयोदशी)",
            29: "Chaturdashi (चतुर्दशी)",
            30: "Amavasya (अमावस्या) - New Moon"
        };

        const paksha = tithiNum <= 15 ? "Shukla Paksha (शुक्ल पक्ष)" : "Krishna Paksha (कृष्ण पक्ष)";
        const tithiIndex = tithiNum;
        
        // Fetch approximate Nakshatra based on moon position angle (approx 27.32 days orbit)
        const siderealMonth = 27.321661;
        const siderealCycles = diffDays / siderealMonth;
        const moonAngle = (siderealCycles - Math.floor(siderealCycles)) * 360;
        const nakshatraIndex = Math.floor(moonAngle / (360 / 27)) + 1;

        const NAKSHATRAS = [
            "Ashwini (अश्विनी)", "Bharani (भरणी)", "Krittika (कृत्तिका)", "Rohini (रोहिणी)", 
            "Mrigashira (मृगशिरा)", "Ardra (आर्द्रा)", "Punarvasu (पुनर्वसु)", "Pushya (पुष्य)", 
            "Ashlesha (आश्लेषा)", "Magha (मघा)", "Purva Phalguni (पूर्वाफाल्गुनी)", "Uttara Phalguni (उत्तराफाल्गुनी)", 
            "Hasta (हस्त)", "Chitra (चित्रा)", "Swati (स्वाती)", "Vishakha (विशाखा)", 
            "Anuradha (अनुराधा)", "Jyeshtha (ज्येष्ठा)", "Mula (मूल)", "Purva Ashadha (पूर्वाषाढ़ा)", 
            "Uttara Ashadha (उत्तराषाढ़ा)", "Shravana (श्रवण)", "Dhanishta (धनिष्ठा)", "Shatabhisha (शतभिषा)", 
            "Purva Bhadrapada (पूर्वाभाद्रपद)", "Uttara Bhadrapada (उत्तराभाद्रपद)", "Revati (रेवती)"
        ];

        const NAKSHATRAS_HINDI = NAKSHATRAS[Math.min(nakshatraIndex - 1, 26)];

        // Get approximate deity based on tithi
        const DEITIES = {
            1: "Agni", 2: "Brahma", 3: "Gauri/Ganesha", 4: "Ganesha", 5: "Lalitha/Nagas",
            6: "Kartikeya", 7: "Surya", 8: "Shiva/Ashta Vasus", 9: "Durga", 10: "Yama",
            11: "Vishnu/Kubera", 12: "Vishnu/Sun", 13: "Kamadeva", 14: "Shiva", 15: "Chandra",
            16: "Agni", 17: "Brahma", 18: "Gauri/Ganesha", 19: "Ganesha", 20: "Lalitha/Nagas",
            21: "Kartikeya", 22: "Surya", 23: "Shiva/Ashta Vasus", 24: "Durga", 25: "Yama",
            26: "Vishnu/Kubera", 27: "Vishnu/Sun", 28: "Kamadeva", 29: "Shiva", 30: "Kali/Ancestors"
        };

        return {
            tithiNum: tithiNum,
            tithiName: TITHIS_HINDI[tithiNum],
            paksha: paksha,
            nakshatra: NAKSHATRAS_HINDI,
            rulingDeity: DEITIES[tithiNum] || "Paramatma"
        };
    },

    /**
     * Full Panchang query for UI
     */
    getPanchang: function(date, lat, lng, timezoneOffsetHours = 5.5) {
        const sun = this.calculateSunriseSunset(date, lat, lng, timezoneOffsetHours);
        const weekdayIndex = date.getDay();
        const rahu = this.calculateRahuKaal(sun.sunriseDecimal, sun.sunsetDecimal, weekdayIndex);
        const choghadiya = this.getChoghadiyaList(sun.sunriseDecimal, sun.sunsetDecimal, weekdayIndex);
        const lunar = this.calculateLunarTithi(date);

        // Calculate active Choghadiya based on current time
        const now = new Date();
        const currentHour = now.getHours() + now.getMinutes() / 60;
        let activeChoghadiya = null;

        if (date.toDateString() === now.toDateString()) {
            for (const item of choghadiya) {
                // Handle split over midnight
                if (item.startDecimal <= item.endDecimal) {
                    if (currentHour >= item.startDecimal && currentHour < item.endDecimal) {
                        activeChoghadiya = item;
                        break;
                    }
                } else { // Split over midnight
                    if (currentHour >= item.startDecimal || currentHour < item.endDecimal) {
                        activeChoghadiya = item;
                        break;
                    }
                }
            }
        }

        // Calculate Rahu Kaal active status
        let isRahuKaalActive = false;
        if (date.toDateString() === now.toDateString()) {
            isRahuKaalActive = currentHour >= rahu.startDecimal && currentHour < rahu.endDecimal;
        }

        // Get auspicious / inauspicious indicators
        const shubhMuhuratTime = `${this.formatDecimal(sun.sunriseDecimal + 2)} - ${this.formatDecimal(sun.sunriseDecimal + 3.5)}`;

        return {
            sunrise: sun.sunrise,
            sunset: sun.sunset,
            rahuKaal: `${rahu.start} to ${rahu.end}`,
            isRahuKaalActive: isRahuKaalActive,
            tithi: lunar.tithiName,
            paksha: lunar.paksha,
            nakshatra: lunar.nakshatra,
            deity: lunar.rulingDeity,
            choghadiya: choghadiya,
            activeChoghadiya: activeChoghadiya,
            shubhMuhurat: shubhMuhuratTime
        };
    },

    formatDecimal: function(decimalHours) {
        const adjustedHours = (decimalHours + 24) % 24;
        const hours = Math.floor(adjustedHours);
        const minutes = Math.floor((adjustedHours - hours) * 60);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 === 0 ? 12 : hours % 12;
        return `${displayHours}:${String(minutes).padStart(2, '0')} ${ampm}`;
    }
};

// Expose calculations window-wide
if (typeof window !== 'undefined') {
    window.PanchangEngine = PanchangEngine;
}
