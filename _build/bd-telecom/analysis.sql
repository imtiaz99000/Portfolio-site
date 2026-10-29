-- Bangladesh mobile market, Aug 2024 to Aug 2026 (BTRC data, millions of active subscriptions)
-- Run with: sqlite3 telecom.db < analysis.sql

-- 1. Market share by operator, every month with a full operator split
SELECT month,
       ROUND(100.0 * grameenphone / total_mobile, 1) AS gp_share,
       ROUND(100.0 * robi         / total_mobile, 1) AS robi_share,
       ROUND(100.0 * banglalink   / total_mobile, 1) AS bl_share,
       ROUND(100.0 * teletalk     / total_mobile, 1) AS tt_share
FROM subscribers
WHERE grameenphone IS NOT NULL AND total_mobile IS NOT NULL
ORDER BY month;

-- 2. Two-year change per operator (first and last month in the data)
WITH ends AS (
  SELECT (SELECT month FROM subscribers WHERE grameenphone IS NOT NULL ORDER BY month LIMIT 1)      AS m0,
         (SELECT month FROM subscribers WHERE grameenphone IS NOT NULL ORDER BY month DESC LIMIT 1) AS m1
), long AS (
  SELECT month, 'Grameenphone' AS operator, grameenphone AS subs FROM subscribers UNION ALL
  SELECT month, 'Robi',       robi       FROM subscribers UNION ALL
  SELECT month, 'Banglalink', banglalink FROM subscribers UNION ALL
  SELECT month, 'Teletalk',   teletalk   FROM subscribers
)
SELECT a.operator, a.subs AS start_subs, b.subs AS end_subs,
       ROUND(b.subs - a.subs, 2)                  AS net_change,
       ROUND(100.0 * (b.subs - a.subs) / a.subs, 1) AS pct_change
FROM long a JOIN long b ON a.operator = b.operator, ends
WHERE a.month = ends.m0 AND b.month = ends.m1
ORDER BY net_change DESC;

-- 3. Month-on-month net adds for the total market (window function, blank when the previous month is missing)
WITH t AS (
  SELECT month, total_mobile,
         LAG(month)        OVER (ORDER BY month) AS prev_month,
         LAG(total_mobile) OVER (ORDER BY month) AS prev_total
  FROM subscribers WHERE total_mobile IS NOT NULL
)
SELECT month, total_mobile,
       CASE WHEN prev_month = strftime('%Y-%m', date(month || '-01', '-1 month'))
            THEN ROUND(total_mobile - prev_total, 2) END AS net_adds
FROM t ORDER BY month;

-- 3b. Who gained and lost during the SIM-limit clean-up (Jul to Dec 2025) and the 2026 recovery (Feb to Aug 2026)
SELECT 'Jul-Dec 2025' AS period,
       ROUND(d.grameenphone - j.grameenphone, 2) AS gp, ROUND(d.robi - j.robi, 2) AS robi,
       ROUND(d.banglalink - j.banglalink, 2) AS bl, ROUND(d.teletalk - j.teletalk, 2) AS tt
FROM subscribers j, subscribers d WHERE j.month = '2025-07' AND d.month = '2025-12'
UNION ALL
SELECT 'Feb-Aug 2026',
       ROUND(a.grameenphone - f.grameenphone, 2), ROUND(a.robi - f.robi, 2),
       ROUND(a.banglalink - f.banglalink, 2), ROUND(a.teletalk - f.teletalk, 2)
FROM subscribers f, subscribers a WHERE f.month = '2026-02' AND a.month = '2026-08';

-- 4. Low point and recovery
SELECT month AS low_month, total_mobile AS low_value,
       ROUND((SELECT total_mobile FROM subscribers WHERE total_mobile IS NOT NULL ORDER BY month DESC LIMIT 1) - total_mobile, 2) AS recovered_since
FROM subscribers
WHERE total_mobile = (SELECT MIN(total_mobile) FROM subscribers);

-- 5. Mobile internet as a share of mobile subscriptions, and fixed broadband growth
SELECT month,
       ROUND(100.0 * mobile_internet / total_mobile, 1) AS mobile_internet_pct_of_subs,
       fixed_internet
FROM subscribers
WHERE mobile_internet IS NOT NULL AND total_mobile IS NOT NULL
ORDER BY month;
