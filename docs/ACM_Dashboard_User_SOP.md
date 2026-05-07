# ACM Dashboard - Standard Operating Procedure (SOP)

**Document Version:** 1.0  
**Last Updated:** April 2026  
**Owner:** AllCare Mar Agency LLC · UHC IMO Partner  
**Audience:** All ACM Dashboard users (Admins and Agency Directors)

---

## 1. Purpose

This SOP defines how authorized users should access, navigate, and use the ACM Dashboard to monitor Book of Business (BOB), retention, agent performance, and growth opportunities across the AllCare Mar IMO network.

The dashboard is updated automatically every Tuesday morning when the new BOB report is published by UHC. Users do not need to refresh data manually.

---

## 2. Access & Authentication

### 2.1 Dashboard URL

Access the dashboard exclusively through this permanent link:

```
https://TU_USUARIO.github.io/acm-dashboard/
```

(Bookmark this URL for daily access)

### 2.2 First-Time Login

1. Navigate to the dashboard URL
2. Enter your assigned email and initial password (provided by the administrator)
3. The system will require you to **change your password** before accessing the dashboard
4. Choose a strong, personal password that **only you know**
5. After the password change, you will be redirected to the main dashboard

### 2.3 Forgot Password

If you forget your password:

1. Click **"Forgot Password?"** on the login screen
2. Enter your registered email
3. The system will display your default password on screen
4. Log in using that default password
5. You will be prompted to set a new password

### 2.4 Confidentiality Agreement

By accessing this dashboard, you agree to:

- **Not share** your login credentials with anyone (including family, colleagues, or other agency members)
- **Not export, screenshot, or distribute** member-level data outside ACM authorized personnel
- **Not use** the data for any purpose other than the management and growth of your assigned book of business
- **Report** any suspicious activity or potential data breach immediately to wmartinez@allcaremar.com

Failure to comply with these terms may result in immediate access revocation and may have legal consequences under HIPAA and ACM's data protection policies.

---

## 3. User Roles & Permissions

| Role | Description | Visibility |
|---|---|---|
| **Admin** | ACM leadership and partners | All agencies, all states, full access to every tab |
| **Director** | Single-agency leader (one per agency) | Filtered to their assigned agency only |

If you are unsure which role you have:
- After login, look at the top-right corner — your name and role are displayed
- If you see a dropdown to filter "All Agencies" you are an **Admin**
- If your view is locked to a single agency name, you are a **Director**

---

## 4. Recommended Daily/Weekly Routines

### 4.1 Daily Quick Check (5 minutes)

Recommended every morning before agent calls:

1. Open the dashboard
2. Look at **Book of Business** tab
3. Note today's totals: members, agents, states
4. Check yesterday's email summary for any alerts

### 4.2 Weekly Deep Review (20-30 minutes) — Recommended on Tuesdays

After the weekly BOB refresh email arrives:

1. **Open the email summary** — review week-over-week changes
2. **Open the dashboard** and review in this order:
   - **Book of Business** — confirm totals match the email
   - **Retention** — review the latest week's retention rate and disenrollment count
   - **Action Plan** — read auto-generated findings and recommendations
   - **Top Agents** — identify your strongest and weakest performers this week
3. **Take action** based on Action Plan recommendations
4. **Share key insights** with your team (verbally or in your weekly meeting)

### 4.3 Monthly Strategic Review (1-2 hours) — Recommended first Monday of each month

1. Compare last 4-5 weekly retention rates → identify trends
2. Review **County Map** for geographic expansion opportunities
3. Review **Opportunity** tab for FFS Gap analysis
4. Review **Top Agents** by state to identify training needs
5. Document goals for the month

---

## 5. Navigating the Dashboard

The dashboard has **7 main tabs**, each focused on a specific analytical view.

### 5.1 ▸ Book of Business Tab

**Purpose:** High-level overview of your current BOB.

**Key metrics displayed:**
- **Active BOB Members** — total active policies in your scope
- **Licensed Agents** — number of unique agents
- **MA-Eligible (CMS)** — addressable Medicare market
- **States** — geographic footprint
- **Market Penetration** — your share of the addressable market

**State cards:** Each state shows BOB members, counties, agents, and CMS eligible.

**How to use it:**
- Use this as your **starting point** every session
- Click on any state card to see detailed breakdown
- Compare BOB Members vs CMS Eligible to identify low-penetration states (growth opportunities)

### 5.2 ▸ County Map Tab

**Purpose:** Visual geographic distribution of your members.

**Features:**
- Interactive map of the United States
- Each county shaded by member density (or CMS eligible if toggled)
- Click any county to see specific data (member count, top agent)
- Auto-zooms based on your state filter

**How to use it:**
- Identify **clustering patterns** — where are your members concentrated?
- Spot **white space opportunities** — counties with high CMS eligibility but low BOB
- Use for **strategic agent deployment** discussions
- Toggle between "BOB Members" mode and "CMS Eligible" mode for comparison

### 5.3 ▸ Zip Heatmap Tab

**Purpose:** Granular zip-code-level penetration analysis.

**Features:**
- Heatmap of all zip codes with active members
- Color intensity reflects member density per zip

**How to use it:**
- Identify your **top 20 zip codes** by member volume
- Spot **opportunity zips** adjacent to your strongest areas
- Use for **direct mail campaign targeting**
- Use for **community event planning**

### 5.4 ▸ Top Agents Tab

**Purpose:** Performance ranking of your top 15 agents.

**Features:**
- Top 15 agents by member count
- Per-state agent summary with the top performer per state
- Filter by state to see top agents in specific markets

**How to use it:**
- Use for **monthly recognition programs**
- Identify **mentor candidates** for new agents
- Spot **agents who may need additional training** (low rankings)
- Compare agent performance **across states**

▲ **Important:** This tab respects your filters. If you select a single agency, you'll see only the top agents from that agency.

### 5.5 ▸ Opportunity Tab

**Purpose:** Identify growth opportunities using CMS Fee-for-Service (FFS) Gap analysis.

**Features:**
- Live data from CMS Medicare Enrollment API
- Shows total FFS-eligible Medicare beneficiaries by state
- Calculates gap between FFS eligible and current MA enrollment
- Highlights states with highest growth potential

**How to use it:**
- Identify **states for expansion**
- Inform **agent recruitment decisions** (where to add agents)
- Support **business development conversations** with UHC
- Use for **annual planning meetings**

### 5.6 ▸ Retention Tab

**Purpose:** Track member retention week-over-week and identify churn patterns.

**Key metrics:**
- **Retention Rate** — % of members from last week who remain this week
- **Retained / New / Win-back / Disenrollment** — flow breakdown
- **Trend Chart** — last 24+ months of retention rates
- **Tenure Distribution** — how long current members have been with you

**Industry benchmark:** MA retention rates of 88-92% are considered standard. **ACM consistently exceeds 99%** — well above industry average.

**How to use it:**
- Monitor **week-over-week retention** for early warning signs
- Watch for **sudden spikes in disenrollment** (may signal a service issue or competitor activity)
- Track **win-backs** as a measure of brand loyalty
- Use **tenure data** to identify members at higher disenrollment risk (those with <6 months tenure are most vulnerable during AEP/OEP)

### 5.7 ▸ Action Plan Tab

**Purpose:** Auto-generated insights and recommendations based on your current data.

**Features:**
- **5 KPI cards** — current totals, retention rate, disenrollment count, gross adds, net delta
- **Key Findings** — automatically generated alerts (color-coded: green = good, yellow = monitor, red = action needed)
- **Recommended Actions** — prioritized list of suggested next steps
- **Definitions panel** — quick reference for retention terminology

**How to use it:**
- Read this tab **every Tuesday** after the BOB refresh email
- Use **Recommended Actions** as your weekly to-do list
- Share **Key Findings** in your team meetings
- Track which recommendations you've completed week-over-week

---

## 6. Understanding Key Terminology

### 6.1 Core Metrics

| Term | Definition |
|---|---|
| **Total Policies** | Total count of active policies in BOB. A member with MA + PDP counts as 2 policies. |
| **Total Members** | Unique member count (deduplicated by MBI). A member with MA + PDP counts as 1 person. |
| **Retained** | Policies present in both the previous and current snapshot |
| **New** | Policies appearing for the first time (never seen before in any snapshot) |
| **Win-back** | Policies that previously existed, were disenrolled, and have now returned |
| **Disenrollment** | Policies that were active in the previous snapshot but are no longer present. Causes include: switched to a competitor (Humana, Aetna, CVS), deceased, lost eligibility (e.g., Medicaid for Dual Complete plans), voluntary cancellation, or plan termination by UHC |
| **Net Delta** | Net change vs previous period: New + Win-backs − Disenrollments |
| **Retention Rate** | Percentage of previous-snapshot policies still active this week |

### 6.2 Geographic Terms

| Term | Definition |
|---|---|
| **CMS Eligible** | Total Medicare-eligible beneficiaries in a state per CMS data |
| **FFS Gap** | Difference between FFS-enrolled beneficiaries and MA-enrolled beneficiaries (potential MA market) |
| **Market Penetration** | Your BOB members divided by CMS Eligible (your share of the addressable market) |

### 6.3 Why "Disenrollment" Instead of "Churn"

We use the term **"Disenrollment"** throughout the dashboard because it is the standard CMS and UHC terminology and more accurately describes the regulatory event of a member leaving an MA plan. "Churn" is a generic business term — "disenrollment" is what you'll see in UHC reports and CMS publications.

---

## 7. Best Practices

### 7.1 For Agency Directors

- ✓ **Check the dashboard at least 3 times per week** — Monday, Tuesday (after refresh), Friday
- ✓ **Read every Tuesday email** carefully — your week starts there
- ✓ **Use the Action Plan tab** as your weekly priority guide
- ✓ **Schedule monthly reviews** with your top 5 agents using the Top Agents tab
- ✓ **Investigate disenrollments quickly** — every disenrolled member is a lost commission and a potential service issue
- ✓ **Document trends** in your own internal tracker for monthly leadership conversations
- ✗ **Don't share screenshots** outside your authorized personnel
- ✗ **Don't make decisions on a single week** — look at 4-week trends

### 7.2 For Administrators

- ✓ **Compare agencies** using the agency filter to identify best practices
- ✓ **Use County Map** for cross-agency strategic planning
- ✓ **Document successful patterns** from top-performing agencies and replicate
- ✓ **Run monthly leadership reviews** using the Action Plan as the agenda
- ✓ **Coordinate with directors** when their Action Plan flags issues
- ✓ **Use Opportunity tab** quarterly for expansion planning

### 7.3 General

- ✓ **Refresh the page** if you don't see new data after a known refresh
- ✓ **Use Chrome, Edge, or Firefox** for best experience (latest versions)
- ✓ **Use a desktop or laptop** — mobile experience is functional but limited
- ✓ **Log out** when finished, especially on shared devices
- ✗ **Don't keep multiple tabs open** with the dashboard — may cause performance issues

---

## 8. Common Use Cases

### 8.1 "I want to know how my agency performed last week"

1. Log in → **Retention** tab
2. Look at the latest week's metrics
3. Check **Net Delta** — positive means growth, negative means net loss
4. Read **Action Plan** for recommendations

### 8.2 "I want to identify our top performers this month"

1. Log in → **Top Agents** tab
2. Note top 5 agents
3. Click into individual states to see geographic specialization
4. Schedule recognition or coaching sessions accordingly

### 8.3 "I want to find growth opportunities"

1. Log in → **Opportunity** tab
2. Sort states by FFS Gap descending
3. Cross-reference with **County Map** for specific counties
4. Use **Zip Heatmap** to identify zip-level targets
5. Discuss agent recruitment for high-opportunity states

### 8.4 "We had a sudden spike in disenrollments — why?"

1. **Retention** tab → identify the spike week
2. Filter by state and agency to narrow scope
3. Check if the spike correlates with:
   - AEP or OEP transitions (October-December, January-March)
   - Specific agent activity (Top Agents tab)
   - Specific geographic area (County Map)
4. Talk to affected agents to investigate root cause
5. Document findings for next quarter's strategy

### 8.5 "I need to prepare a quarterly review presentation"

1. **Book of Business** → screenshot top metrics
2. **Retention** → screenshot 12-week trend chart
3. **Top Agents** → list top 10 with member counts
4. **Opportunity** → list top 5 expansion opportunities
5. **Action Plan** → list top 3 priorities for next quarter

---

## 9. Troubleshooting

### 9.1 "I can't log in"

1. Verify you're using the correct URL: `https://TU_USUARIO.github.io/acm-dashboard/`
2. Verify your email is typed exactly as registered (case-sensitive)
3. Try the **"Forgot Password?"** flow
4. If still stuck, contact wmartinez@allcaremar.com

### 9.2 "The dashboard is showing old data"

1. **Hard refresh** your browser:
   - Windows: Ctrl + F5
   - Mac: Cmd + Shift + R
2. Verify the **"As of [date]"** in the header — should reflect the latest BOB
3. If still stale after 1 hour, the auto-refresh may have failed → contact admin

### 9.3 "A tab shows no data when I filter"

This is a known scenario:
- Filtering by a small agency + small state combination may yield zero results
- Try removing the state filter to see all your agency's data
- If you're a Director, you cannot remove your agency filter (by design)

### 9.4 "I see different numbers than the email summary"

The email reflects data **at the moment of refresh**. If you log in immediately after, numbers should match.

If they don't match:
- Verify both reference the same snapshot date
- The dashboard may have been refreshed since the email
- Wait 5 minutes and refresh

### 9.5 "I can't access a feature I used to access"

Permissions may have changed. Contact the admin to verify your role.

---

## 10. Data Refresh Schedule

| Event | Frequency | Time |
|---|---|---|
| BOB file received from UHC | Weekly (Tuesdays) | Morning |
| Auto-detection of new file | Every 10 minutes | 24/7 |
| Dashboard re-deployment | After each new BOB | ~3 minutes after detection |
| Email notification sent | Once per refresh | After successful deployment |

**You do not need to do anything to trigger a refresh.** The system handles everything automatically.

---

## 11. Support & Contact

### Primary Contact

**Waldo Martinez**  
Owner, AllCare Mar Agency LLC  
Email: wmartinez@allcaremar.com

### Secondary Contact

**Jesus Cabreja**  
Email: jcabreja@allcaremar.com

### Support Hours

- **Critical issues** (cannot access dashboard): Same-day response
- **Data questions** (interpretation, definitions): 1-2 business days
- **Feature requests** or training needs: Schedule a meeting

When reporting an issue, please include:
1. Your name and email
2. The tab/section where the issue occurred
3. A screenshot of the issue (if possible)
4. The date and time it occurred
5. Steps to reproduce

---

## 12. Important Reminders

▲ **NEVER share your password** with anyone — including other ACM employees

▲ **NEVER export or distribute** member-level data outside ACM authorized personnel

▲ **NEVER use the data** for any purpose other than ACM business operations

▲ **ALWAYS log out** on shared devices

▲ **ALWAYS report** suspicious activity immediately

✓ **ALWAYS check** the dashboard before making operational decisions

✓ **ALWAYS verify** numbers match the official UHC reports if there's a discrepancy

✓ **ALWAYS contact** the admin if something doesn't look right

---

## 13. Acknowledgment

By using the ACM Dashboard, you acknowledge that:

1. You have read and understood this SOP
2. You agree to follow the security and confidentiality requirements
3. You will use the data exclusively for ACM business purposes
4. You understand that violation of these terms may result in access revocation and potential legal consequences

For questions about this SOP, contact wmartinez@allcaremar.com.

---

**Document Control**

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | April 2026 | Waldo Martinez | Initial version |

---

*This document is confidential and proprietary to AllCare Mar Agency LLC. Distribution outside authorized ACM personnel is strictly prohibited.*
