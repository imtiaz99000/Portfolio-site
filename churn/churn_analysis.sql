-- Telco customer churn: which customers leave, and when
-- Mohd Imtiaz Karim, October 2026
--
-- Data: IBM Telco Customer Churn sample (the Kaggle "Telco Customer Churn" dataset),
-- 7,043 customers of a fictional US telecom, one row per customer.
-- Engine: SQLite. Load the CSV into a table called `raw` first, for example:
--   sqlite3 churn.db ".import --csv Telco-Customer-Churn.csv raw"
-- Every query below runs as written on SQLite and needs only small changes for PostgreSQL.


-- 0. Clean view -----------------------------------------------------------------
-- TotalCharges arrives as text and is blank for 11 brand-new customers (tenure 0).
-- Churn becomes 1/0 so AVG() gives the churn rate directly.
-- Tenure is grouped into bands a channel team would actually talk about.

DROP VIEW IF EXISTS customers;
CREATE VIEW customers AS
SELECT
  customerID                                         AS customer_id,
  gender,
  CAST(SeniorCitizen AS INTEGER)                     AS senior,
  Partner                                            AS partner,
  Dependents                                         AS dependents,
  CAST(tenure AS INTEGER)                            AS tenure,
  CASE
    WHEN CAST(tenure AS INTEGER) <= 6  THEN '1. 0-6 months'
    WHEN CAST(tenure AS INTEGER) <= 12 THEN '2. 7-12 months'
    WHEN CAST(tenure AS INTEGER) <= 24 THEN '3. 13-24 months'
    WHEN CAST(tenure AS INTEGER) <= 48 THEN '4. 25-48 months'
    ELSE                                    '5. 49+ months'
  END                                                AS tenure_band,
  PhoneService                                       AS phone_service,
  InternetService                                    AS internet,
  OnlineSecurity                                     AS online_security,
  OnlineBackup                                       AS online_backup,
  DeviceProtection                                   AS device_protection,
  TechSupport                                        AS tech_support,
  StreamingTV                                        AS streaming_tv,
  StreamingMovies                                    AS streaming_movies,
  Contract                                           AS contract,
  PaperlessBilling                                   AS paperless,
  PaymentMethod                                      AS payment_method,
  CAST(MonthlyCharges AS REAL)                       AS monthly_charges,
  CAST(NULLIF(TRIM(TotalCharges), '') AS REAL)       AS total_charges,
  CASE WHEN Churn = 'Yes' THEN 1 ELSE 0 END          AS churned
FROM raw;


-- 1. The baseline ---------------------------------------------------------------
-- How many customers, how many left, and how much monthly revenue walked out.

SELECT
  COUNT(*)                                                   AS customers,
  SUM(churned)                                               AS churned,
  ROUND(100.0 * AVG(churned), 1)                             AS churn_pct,
  ROUND(SUM(monthly_charges), 0)                             AS monthly_revenue,
  ROUND(SUM(CASE WHEN churned = 1 THEN monthly_charges END), 0) AS revenue_lost,
  ROUND(100.0 * SUM(CASE WHEN churned = 1 THEN monthly_charges END)
        / SUM(monthly_charges), 1)                           AS revenue_lost_pct
FROM customers;


-- 2. Contract type --------------------------------------------------------------

SELECT
  contract,
  COUNT(*)                        AS customers,
  SUM(churned)                    AS churned,
  ROUND(100.0 * AVG(churned), 1)  AS churn_pct,
  ROUND(100.0 * SUM(churned) / (SELECT SUM(churned) FROM customers), 1) AS share_of_all_churn
FROM customers
GROUP BY contract
ORDER BY churn_pct DESC;


-- 3. Tenure: when do customers leave? -------------------------------------------

SELECT
  tenure_band,
  COUNT(*)                        AS customers,
  SUM(churned)                    AS churned,
  ROUND(100.0 * AVG(churned), 1)  AS churn_pct,
  ROUND(100.0 * SUM(churned) / (SELECT SUM(churned) FROM customers), 1) AS share_of_all_churn
FROM customers
GROUP BY tenure_band
ORDER BY tenure_band;

-- 3b. The first year, month by month, with a running share of all churners

WITH by_month AS (
  SELECT tenure, COUNT(*) AS customers, SUM(churned) AS churned
  FROM customers
  WHERE tenure BETWEEN 1 AND 12
  GROUP BY tenure
)
SELECT
  tenure,
  customers,
  churned,
  ROUND(100.0 * churned / customers, 1) AS churn_pct,
  ROUND(100.0 * SUM(churned) OVER (ORDER BY tenure)
        / (SELECT SUM(churned) FROM customers), 1) AS cumulative_share_of_churn
FROM by_month
ORDER BY tenure;


-- 4. Contract and tenure together ------------------------------------------------
-- Is month-to-month only risky early on, or all the way through?

SELECT
  contract,
  tenure_band,
  COUNT(*)                        AS customers,
  ROUND(100.0 * AVG(churned), 1)  AS churn_pct
FROM customers
GROUP BY contract, tenure_band
HAVING COUNT(*) >= 50
ORDER BY contract, tenure_band;


-- 5. Internet service -------------------------------------------------------------

SELECT
  internet,
  COUNT(*)                          AS customers,
  ROUND(100.0 * AVG(churned), 1)    AS churn_pct,
  ROUND(AVG(monthly_charges), 2)    AS avg_monthly_charge
FROM customers
GROUP BY internet
ORDER BY churn_pct DESC;


-- 6. Support add-ons, internet customers only --------------------------------------
-- Customers with security or tech support behave very differently.

SELECT 'Online security' AS add_on, online_security AS has_it,
       COUNT(*) AS customers, ROUND(100.0 * AVG(churned), 1) AS churn_pct
FROM customers WHERE internet <> 'No' GROUP BY online_security
UNION ALL
SELECT 'Tech support', tech_support,
       COUNT(*), ROUND(100.0 * AVG(churned), 1)
FROM customers WHERE internet <> 'No' GROUP BY tech_support
UNION ALL
SELECT 'Online backup', online_backup,
       COUNT(*), ROUND(100.0 * AVG(churned), 1)
FROM customers WHERE internet <> 'No' GROUP BY online_backup
UNION ALL
SELECT 'Device protection', device_protection,
       COUNT(*), ROUND(100.0 * AVG(churned), 1)
FROM customers WHERE internet <> 'No' GROUP BY device_protection
ORDER BY add_on, has_it;

-- 6b. Neither security nor tech support, by internet type

SELECT
  internet,
  CASE WHEN online_security = 'Yes' OR tech_support = 'Yes'
       THEN 'Has security or support' ELSE 'Neither' END AS support_status,
  COUNT(*)                        AS customers,
  ROUND(100.0 * AVG(churned), 1)  AS churn_pct
FROM customers
WHERE internet <> 'No'
GROUP BY internet, support_status
ORDER BY internet, support_status;


-- 7. How they pay -----------------------------------------------------------------

SELECT
  payment_method,
  COUNT(*)                        AS customers,
  ROUND(100.0 * AVG(churned), 1)  AS churn_pct,
  ROUND(100.0 * SUM(churned) / (SELECT SUM(churned) FROM customers), 1) AS share_of_all_churn
FROM customers
GROUP BY payment_method
ORDER BY churn_pct DESC;

-- 7b. Paperless billing

SELECT paperless, COUNT(*) AS customers, ROUND(100.0 * AVG(churned), 1) AS churn_pct
FROM customers GROUP BY paperless;


-- 8. Who the customer is ----------------------------------------------------------

SELECT 'Senior citizen' AS attribute, CASE senior WHEN 1 THEN 'Yes' ELSE 'No' END AS value,
       COUNT(*) AS customers, ROUND(100.0 * AVG(churned), 1) AS churn_pct
FROM customers GROUP BY senior
UNION ALL
SELECT 'Partner', partner, COUNT(*), ROUND(100.0 * AVG(churned), 1)
FROM customers GROUP BY partner
UNION ALL
SELECT 'Dependents', dependents, COUNT(*), ROUND(100.0 * AVG(churned), 1)
FROM customers GROUP BY dependents
UNION ALL
SELECT 'Gender', gender, COUNT(*), ROUND(100.0 * AVG(churned), 1)
FROM customers GROUP BY gender
ORDER BY attribute, value;


-- 9. Price: does a bigger bill push people out? ------------------------------------

SELECT
  CASE
    WHEN monthly_charges < 35 THEN '1. Under $35'
    WHEN monthly_charges < 70 THEN '2. $35 to $70'
    WHEN monthly_charges < 90 THEN '3. $70 to $90'
    ELSE                           '4. $90 and up'
  END                             AS monthly_bill,
  COUNT(*)                        AS customers,
  ROUND(100.0 * AVG(churned), 1)  AS churn_pct
FROM customers
GROUP BY monthly_bill
ORDER BY monthly_bill;


-- 10. Stickiness: number of extra services ------------------------------------------
-- Counts the six internet add-ons a customer holds (security, backup, protection,
-- tech support, streaming TV, streaming movies). Internet customers only.

WITH add_ons AS (
  SELECT
    churned,
    (online_security   = 'Yes') + (online_backup    = 'Yes') +
    (device_protection = 'Yes') + (tech_support     = 'Yes') +
    (streaming_tv      = 'Yes') + (streaming_movies = 'Yes') AS n_add_ons
  FROM customers
  WHERE internet <> 'No'
)
SELECT
  n_add_ons,
  COUNT(*)                        AS customers,
  ROUND(100.0 * AVG(churned), 1)  AS churn_pct
FROM add_ons
GROUP BY n_add_ons
ORDER BY n_add_ons;


-- 11. The high-risk profile ---------------------------------------------------------
-- Month-to-month, fiber, no security or support, in the first 12 months.
-- How big is this group, and how much of all churn does it explain?

WITH flagged AS (
  SELECT *,
    CASE WHEN contract = 'Month-to-month'
          AND internet = 'Fiber optic'
          AND online_security = 'No' AND tech_support = 'No'
          AND tenure <= 12
         THEN 1 ELSE 0 END AS high_risk
  FROM customers
)
SELECT
  CASE high_risk WHEN 1 THEN 'High-risk profile' ELSE 'Everyone else' END AS segment,
  COUNT(*)                                                         AS customers,
  ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM customers), 1)    AS share_of_base,
  SUM(churned)                                                     AS churned,
  ROUND(100.0 * AVG(churned), 1)                                   AS churn_pct,
  ROUND(100.0 * SUM(churned) / (SELECT SUM(churned) FROM customers), 1) AS share_of_all_churn,
  ROUND(SUM(CASE WHEN churned = 1 THEN monthly_charges END), 0)    AS revenue_lost
FROM flagged
GROUP BY high_risk
ORDER BY high_risk DESC;


-- 12. A simple risk score the field can use ------------------------------------------
-- One point for each warning sign. No model, just rules a supervisor can check by hand.

WITH scored AS (
  SELECT churned, monthly_charges,
    (contract = 'Month-to-month')
  + (tenure <= 12)
  + (internet = 'Fiber optic')
  + (internet <> 'No' AND online_security = 'No' AND tech_support = 'No')
  + (payment_method = 'Electronic check') AS risk_points
  FROM customers
)
SELECT
  risk_points,
  COUNT(*)                                                        AS customers,
  ROUND(100.0 * AVG(churned), 1)                                  AS churn_pct,
  ROUND(100.0 * SUM(churned) / (SELECT SUM(churned) FROM customers), 1) AS share_of_all_churn
FROM scored
GROUP BY risk_points
ORDER BY risk_points;

-- 12b. Where to draw the line: customers with 4 or more points

WITH scored AS (
  SELECT churned, monthly_charges,
    (contract = 'Month-to-month')
  + (tenure <= 12)
  + (internet = 'Fiber optic')
  + (internet <> 'No' AND online_security = 'No' AND tech_support = 'No')
  + (payment_method = 'Electronic check') AS risk_points
  FROM customers
)
SELECT
  CASE WHEN risk_points >= 4 THEN 'Call list (4-5 points)' ELSE 'Everyone else' END AS tier,
  COUNT(*)                                                        AS customers,
  ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM customers), 1)   AS share_of_base,
  ROUND(100.0 * AVG(churned), 1)                                  AS churn_pct,
  ROUND(100.0 * SUM(churned) / (SELECT SUM(churned) FROM customers), 1) AS share_of_all_churn
FROM scored
GROUP BY tier
ORDER BY tier;
