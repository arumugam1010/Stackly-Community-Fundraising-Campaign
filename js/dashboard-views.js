// Dashboard Views and Dedicated Sidebars for 3 Roles: Admin, Donor, Volunteer

const SIDEBAR_CONFIGS = {
    admin: {
        title: "Admin Panel",
        items: [
            { num: 1, title: "Admin Overview", icon: "flaticon-menu" },
            { num: 2, title: "Total Funds & Ledger", icon: "flaticon-package", badge: "$482k" },
            { num: 3, title: "Campaign Management", icon: "flaticon-up-right-arrow", badge: "48" },
            { num: 4, title: "Donor Database", icon: "flaticon-account", badge: "2.4k" },
            { num: 5, title: "Volunteer Workforce", icon: "flaticon-team", badge: "195" },
            { num: 6, title: "Event Operations", icon: "flaticon-calendar", badge: "8" },
            { num: 7, title: "Financial & Tax Audits", icon: "flaticon-package" },
            { num: 8, title: "Analytics & Outreach", icon: "flaticon-relationship" },
            { num: 9, title: "Inquiries & Feedback", icon: "flaticon-mail", badge: "14" },
            { num: 10, title: "System & Permissions", icon: "flaticon-dots" }
        ]
    },
    donor: {
        title: "Donor Portal",
        items: [
            { num: 1, title: "Donor Dashboard", icon: "flaticon-menu" },
            { num: 2, title: "My Donation History", icon: "flaticon-price-tag", badge: "12" },
            { num: 3, title: "Tax Receipts & 501(c)(3)", icon: "flaticon-package", badge: "PDF" },
            { num: 4, title: "Explore Urgent Causes", icon: "flaticon-up-right-arrow" },
            { num: 5, title: "Recurring Gifts & Pledges", icon: "flaticon-relationship", badge: "Active" },
            { num: 6, title: "My Impact & Lives Touched", icon: "flaticon-account", badge: "1.4k" },
            { num: 7, title: "VIP Events & Invitations", icon: "flaticon-calendar" },
            { num: 8, title: "Donor Honors & Badges", icon: "flaticon-tick", badge: "Gold" },
            { num: 9, title: "Charity Officer Support", icon: "flaticon-mail" },
            { num: 10, title: "Payment & Anonymity", icon: "flaticon-price-tag" }
        ]
    },
    volunteer: {
        title: "Volunteer Hub",
        items: [
            { num: 1, title: "Volunteer Dashboard", icon: "flaticon-menu" },
            { num: 2, title: "My Assigned Field Tasks", icon: "flaticon-tick", badge: "5 Due" },
            { num: 3, title: "Hours Log & Timesheet", icon: "flaticon-package", badge: "148h" },
            { num: 4, title: "Upcoming Shifts & Roster", icon: "flaticon-calendar", badge: "Next: 29th" },
            { num: 5, title: "Disaster Relief Camps", icon: "flaticon-location" },
            { num: 6, title: "Certifications & Badges", icon: "flaticon-star", badge: "Level 3" },
            { num: 7, title: "Field Team Directory", icon: "flaticon-team", badge: "32" },
            { num: 8, title: "Emergency Bulletins", icon: "flaticon-telephone-call-1", badge: "2 Alert" },
            { num: 9, title: "Supervisor Chat & Inbox", icon: "flaticon-mail", badge: "New" },
            { num: 10, title: "Availability & Profile", icon: "flaticon-account" }
        ]
    }
};

let currentRole = 'donor';
let currentActiveItem = 1;

function getAuth() {
    try {
        return JSON.parse(localStorage.getItem('charitics_auth') || '{}');
    } catch (e) {
        return {};
    }
}

// Render dedicated sidebar
function renderSidebar(role) {
    const config = SIDEBAR_CONFIGS[role] || SIDEBAR_CONFIGS.donor;
    const titleEl = document.getElementById('dash-sidebar-title');
    const listEl = document.getElementById('dash-nav-list');

    if (titleEl) titleEl.textContent = config.title;
    if (listEl) {
        listEl.innerHTML = config.items.map(item => `
            <li class="dash-nav-item">
                <a href="javascript:void(0)" class="dash-nav-link ${item.num === currentActiveItem ? 'active' : ''}" data-item="${item.num}" onclick="selectSidebarItem(event, ${item.num})">
                    <i class="${item.icon}"></i>
                    <span>${item.title}</span>
                    ${item.badge ? `<span class="dash-nav-badge">${item.badge}</span>` : ''}
                </a>
            </li>
        `).join('');
    }
}

// Select a sidebar item and render its page view inside the dashboard
// CRITICAL: NEVER REDIRECTS TO 404!
function selectSidebarItem(event, itemNum) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const num = Number(itemNum);
    currentActiveItem = num;

    // Update active class in sidebar
    document.querySelectorAll('.dash-nav-link').forEach((link) => {
        if (Number(link.getAttribute('data-item')) === num) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Close mobile drawer if open
    closeMobileSidebar();

    // Render corresponding view content
    renderMainView(currentRole, num);
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('dash-sidebar');
    const backdrop = document.getElementById('dash-backdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove('dash-no-scroll');
    document.documentElement.classList.remove('dash-no-scroll');
}

function openMobileSidebar() {
    const sidebar = document.getElementById('dash-sidebar');
    const backdrop = document.getElementById('dash-backdrop');
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.classList.add('dash-no-scroll');
    document.documentElement.classList.add('dash-no-scroll');
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('dash-sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
        closeMobileSidebar();
    } else {
        openMobileSidebar();
    }
}

// Render the main dashboard content based on role and active item
function renderMainView(role, itemNum) {
    const container = document.getElementById('dash-main-container');
    if (!container) return;

    if (role === 'admin') {
        container.innerHTML = getAdminViewHTML(Number(itemNum));
    } else if (role === 'volunteer') {
        container.innerHTML = getVolunteerViewHTML(Number(itemNum));
    } else {
        container.innerHTML = getDonorViewHTML(Number(itemNum));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// ADMIN VIEWS (1 to 10 Dedicated Pages)
// ==========================================
function getAdminViewHTML(num) {
    const auth = getAuth();
    const adminName = auth.name || 'Administrator';

    switch(num) {
        case 1:
            return `
                <div class="dash-card mb-4" style="background: linear-gradient(135deg, #1e252f 0%, #2a3443 100%); color: #fff;">
                    <div class="dash-card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <span class="badge mb-2" style="background: var(--ul-primary, #EB5310); font-size: 12px;">Active Role: ADMIN</span>
                            <h2 style="font-weight: 800; font-size: clamp(20px, 2.5vw, 28px); margin: 0;">Welcome, ${adminName}!</h2>
                            <p style="color: #cbd5e1; font-size: 14px; margin-top: 6px; margin-bottom: 0;">
                                Full administrative control over NGO programs, donor funds, and field operations.
                            </p>
                        </div>
                        <div class="d-flex gap-2">
                            <a href="404.html" class="btn-dash-action"><i class="flaticon-up-right-arrow"></i> Create New Campaign</a>
                            <a href="404.html" class="btn-dash-action btn-dash-secondary"><i class="flaticon-package"></i> Generate Audit Report</a>
                        </div>
                    </div>
                </div>

                <div class="row g-3 mb-4">
                    <div class="col-lg-3 col-sm-6">
                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-icon-orange"><i class="flaticon-relationship"></i></div>
                            <div><div class="stat-title">Total Funds Managed</div><div class="stat-val">$482,900</div><div class="stat-meta">↑ 18.4% YoY</div></div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-icon-green"><i class="flaticon-package"></i></div>
                            <div><div class="stat-title">Active Campaigns</div><div class="stat-val">48 Projects</div><div class="stat-meta">92% on target</div></div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-icon-blue"><i class="flaticon-team"></i></div>
                            <div><div class="stat-title">Total Active Donors</div><div class="stat-val">2,480 Donors</div><div class="stat-meta">+140 this month</div></div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-icon-purple"><i class="flaticon-calendar"></i></div>
                            <div><div class="stat-title">Volunteer Workforce</div><div class="stat-val">195 Active</div><div class="stat-meta">Across 14 regions</div></div>
                        </div>
                    </div>
                </div>

                <div class="dash-card">
                    <div class="dash-card-header">
                        <h3 class="dash-card-title">Active NGO Programs & Allocations</h3>
                        <div class="d-flex gap-2">
                            <a href="404.html" class="btn-dash-action btn-dash-secondary"><i class="flaticon-search"></i> Filter Programs</a>
                            <a href="404.html" class="btn-dash-action"><i class="flaticon-up-right-arrow"></i> Manage All</a>
                        </div>
                    </div>
                    <div class="dash-card-body p-0">
                        <div class="table-responsive">
                            <table class="dash-table table align-middle">
                                <thead>
                                    <tr><th>Program / Campaign</th><th>Department</th><th>Budget Allocation</th><th>Status</th><th>Lead Director</th><th class="text-end">Action</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td><div class="fw-bold">Global Clean Water Initiative</div><span class="text-muted" style="font-size: 11px;">Ref: #ADM-CW01</span></td><td>Sanitation & Infrastructure</td><td class="fw-bold text-success">$140,000 / $150,000</td><td><span class="badge bg-success">93% Funded</span></td><td>Dr. Sarah Jenkins</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Audit Log</a></td></tr>
                                    <tr><td><div class="fw-bold">Emergency Drought Relief Fund</div><span class="text-muted" style="font-size: 11px;">Ref: #ADM-DR02</span></td><td>Disaster Management</td><td class="fw-bold text-success">$85,400 / $100,000</td><td><span class="badge bg-primary">Active</span></td><td>Marcus Sterling</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Audit Log</a></td></tr>
                                    <tr><td><div class="fw-bold">Vocational Youth Training Centers</div><span class="text-muted" style="font-size: 11px;">Ref: #ADM-ED03</span></td><td>Education & Skilling</td><td class="fw-bold text-success">$210,000 / $250,000</td><td><span class="badge bg-success">Completed</span></td><td>Elena Rodriguez</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Audit Log</a></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

        case 2:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">Total Funds & Financial Ledger</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Real-time master balance, wire clearances, and programmatic disbursements.</p>
                        </div>
                        <div class="d-flex gap-2">
                            <a href="404.html" class="btn-dash-action"><i class="flaticon-package"></i> Export Ledger CSV</a>
                            <a href="404.html" class="btn-dash-action btn-dash-secondary"><i class="flaticon-settings"></i> Record Manual Entry</a>
                        </div>
                    </div>
                    <div class="dash-card-body">
                        <div class="row g-3 mb-4">
                            <div class="col-md-3"><div class="p-3 border rounded-3 bg-light text-center"><div class="small text-muted">Net Receipts</div><h4 class="text-success fw-bold my-1">$482,900</h4><span class="badge bg-success">Audited</span></div></div>
                            <div class="col-md-3"><div class="p-3 border rounded-3 bg-light text-center"><div class="small text-muted">Disbursed Funds</div><h4 class="text-primary fw-bold my-1">$394,150</h4><span class="badge bg-primary">81.6% Utilized</span></div></div>
                            <div class="col-md-3"><div class="p-3 border rounded-3 bg-light text-center"><div class="small text-muted">Emergency Reserve</div><h4 class="text-dark fw-bold my-1">$88,750</h4><span class="badge bg-warning text-dark">Protected</span></div></div>
                            <div class="col-md-3"><div class="p-3 border rounded-3 bg-light text-center"><div class="small text-muted">Platform Overheads</div><h4 class="text-secondary fw-bold my-1">$0.00</h4><span class="badge bg-info text-dark">Zero Fee</span></div></div>
                        </div>

                        <div class="table-responsive">
                            <table class="dash-table table align-middle">
                                <thead>
                                    <tr><th>Transaction ID</th><th>Contributor</th><th>Fund Allocation</th><th>Amount</th><th>Method</th><th>Status</th><th class="text-end">Action</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td><span class="fw-bold">#TX-98421</span></td><td>Apex Global Foundation</td><td>Clean Water Expansion</td><td class="fw-bold text-success">$25,000</td><td>Direct Wire</td><td><span class="badge bg-success">Cleared</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Receipt</a></td></tr>
                                    <tr><td><span class="fw-bold">#TX-98418</span></td><td>Eleanor Vance</td><td>Emergency Food Kits</td><td class="fw-bold text-success">$500</td><td>Stripe CC</td><td><span class="badge bg-success">Cleared</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Receipt</a></td></tr>
                                    <tr><td><span class="fw-bold">#TX-98412</span></td><td>St. Matthew Parish</td><td>Youth Training Hub</td><td class="fw-bold text-success">$3,400</td><td>ACH Direct</td><td><span class="badge bg-warning text-dark">Pending Clearance</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Receipt</a></td></tr>
                                    <tr><td><span class="fw-bold">#TX-98399</span></td><td>BioHealth Corp</td><td>Medical Camp Mobile Units</td><td class="fw-bold text-success">$18,000</td><td>Direct Wire</td><td><span class="badge bg-success">Cleared</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Receipt</a></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

        case 3:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">Campaign Management</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Manage live crowdfunding drives, track target meters, and adjust milestones.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-up-right-arrow"></i> + Create New Campaign</a>
                    </div>
                    <div class="dash-card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="p-3 border rounded-3 bg-light">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h5 class="mb-0">Clean Water for Rural Communities</h5>
                                        <span class="badge bg-success">Active</span>
                                    </div>
                                    <p class="text-muted mb-3" style="font-size: 13px;">Drilling 45 solar borewells in drought-affected drought belts.</p>
                                    <div class="progress mb-2" style="height: 10px;"><div class="progress-bar bg-success" style="width: 88%;"></div></div>
                                    <div class="d-flex justify-content-between small text-muted"><span>Raised: $140,000</span><span>Goal: $160,000</span></div>
                                    <div class="mt-3 d-flex gap-2">
                                        <a href="404.html" class="btn btn-sm btn-dash-action">Edit Campaign</a>
                                        <a href="404.html" class="btn btn-sm btn-outline-secondary">Pause Campaign</a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-3 border rounded-3 bg-light">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h5 class="mb-0">Children Winter Clothing Drive</h5>
                                        <span class="badge bg-primary">In Progress</span>
                                    </div>
                                    <p class="text-muted mb-3" style="font-size: 13px;">Providing jackets and thermal footwear for refugee centers.</p>
                                    <div class="progress mb-2" style="height: 10px;"><div class="progress-bar bg-primary" style="width: 65%;"></div></div>
                                    <div class="d-flex justify-content-between small text-muted"><span>Raised: $45,500</span><span>Goal: $70,000</span></div>
                                    <div class="mt-3 d-flex gap-2">
                                        <a href="404.html" class="btn btn-sm btn-dash-action">Edit Campaign</a>
                                        <a href="404.html" class="btn btn-sm btn-outline-secondary">Pause Campaign</a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-3 border rounded-3 bg-light">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h5 class="mb-0">Mobile Medical Clinic Outreaches</h5>
                                        <span class="badge bg-success">Active</span>
                                    </div>
                                    <p class="text-muted mb-3" style="font-size: 13px;">Deploying fully equipped mobile vans for free health checks.</p>
                                    <div class="progress mb-2" style="height: 10px;"><div class="progress-bar bg-success" style="width: 92%;"></div></div>
                                    <div class="d-flex justify-content-between small text-muted"><span>Raised: $92,000</span><span>Goal: $100,000</span></div>
                                    <div class="mt-3 d-flex gap-2">
                                        <a href="404.html" class="btn btn-sm btn-dash-action">Edit Campaign</a>
                                        <a href="404.html" class="btn btn-sm btn-outline-secondary">Pause Campaign</a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-3 border rounded-3 bg-light">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h5 class="mb-0">Disaster Emergency Food Relief Kits</h5>
                                        <span class="badge bg-warning text-dark">Urgent Priority</span>
                                    </div>
                                    <p class="text-muted mb-3" style="font-size: 13px;">Emergency ready-to-eat dry rations and water bottles.</p>
                                    <div class="progress mb-2" style="height: 10px;"><div class="progress-bar bg-warning" style="width: 91%;"></div></div>
                                    <div class="d-flex justify-content-between small text-muted"><span>Raised: $110,000</span><span>Goal: $120,000</span></div>
                                    <div class="mt-3 d-flex gap-2">
                                        <a href="404.html" class="btn btn-sm btn-dash-action">Edit Campaign</a>
                                        <a href="404.html" class="btn btn-sm btn-outline-secondary">Pause Campaign</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        case 4:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">Donor Database & CRM</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Complete registry of individual supporters, corporate benefactors, and philanthropists.</p>
                        </div>
                        <div class="d-flex gap-2">
                            <a href="404.html" class="btn-dash-action"><i class="flaticon-user"></i> + Add New Donor</a>
                            <a href="404.html" class="btn-dash-action btn-dash-secondary"><i class="flaticon-package"></i> Export CRM CSV</a>
                        </div>
                    </div>
                    <div class="dash-card-body">
                        <div class="row g-3 mb-4">
                            <div class="col-md-3"><div class="p-3 border rounded-3 bg-light text-center"><div class="small text-muted">Total Donors</div><h4 class="text-dark fw-bold my-1">2,480</h4><span class="badge bg-success">+140 this month</span></div></div>
                            <div class="col-md-3"><div class="p-3 border rounded-3 bg-light text-center"><div class="small text-muted">Major Benefactors ($10k+)</div><h4 class="text-primary fw-bold my-1">38 Donors</h4><span class="badge bg-primary">High Value</span></div></div>
                            <div class="col-md-3"><div class="p-3 border rounded-3 bg-light text-center"><div class="small text-muted">Monthly Recurring</div><h4 class="text-success fw-bold my-1">620 Givers</h4><span class="badge bg-success">Automated</span></div></div>
                            <div class="col-md-3"><div class="p-3 border rounded-3 bg-light text-center"><div class="small text-muted">Average Gift</div><h4 class="text-secondary fw-bold my-1">$194.50</h4><span class="badge bg-info text-dark">↑ 8.2%</span></div></div>
                        </div>

                        <div class="table-responsive">
                            <table class="dash-table table align-middle">
                                <thead><tr><th>Donor Name</th><th>Email & Contact</th><th>Giving Tier</th><th>Lifetime Total</th><th>Last Gift</th><th class="text-end">Profile</th></tr></thead>
                                <tbody>
                                    <tr><td><div class="fw-bold">Jonathan Albright</div><span class="text-muted" style="font-size: 11px;">Apex Holdings Inc.</span></td><td>j.albright@apex.org</td><td><span class="badge bg-warning text-dark">Diamond Patron</span></td><td class="fw-bold text-success">$45,000</td><td>July 14, 2026</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">View Profile</a></td></tr>
                                    <tr><td><div class="fw-bold">Elena Vance</div><span class="text-muted" style="font-size: 11px;">Private Supporter</span></td><td>elena.vance@gmail.com</td><td><span class="badge bg-info text-dark">Gold Benefactor</span></td><td class="fw-bold text-success">$14,850</td><td>July 02, 2026</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">View Profile</a></td></tr>
                                    <tr><td><div class="fw-bold">David Chen</div><span class="text-muted" style="font-size: 11px;">Silicon Philanthropy</span></td><td>dchen@siliconfound.org</td><td><span class="badge bg-primary">Platinum Tier</span></td><td class="fw-bold text-success">$28,000</td><td>June 29, 2026</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">View Profile</a></td></tr>
                                    <tr><td><div class="fw-bold">Sarah O'Connor</div><span class="text-muted" style="font-size: 11px;">Community Pillar</span></td><td>soconnor@dublinmail.ie</td><td><span class="badge bg-secondary">Silver Supporter</span></td><td class="fw-bold text-success">$5,200</td><td>June 15, 2026</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">View Profile</a></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

        case 5:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">Volunteer Workforce & Field Units</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Manage 195 active registered volunteers, deploy teams, and review hours certifications.</p>
                        </div>
                        <div class="d-flex gap-2">
                            <a href="404.html" class="btn-dash-action"><i class="flaticon-team"></i> Recruit Volunteer</a>
                            <a href="404.html" class="btn-dash-action btn-dash-secondary"><i class="flaticon-calendar"></i> Deploy Field Squad</a>
                        </div>
                    </div>
                    <div class="dash-card-body">
                        <div class="row g-3 mb-4">
                            <div class="col-md-3"><div class="p-3 border rounded-3 bg-light text-center"><div class="small text-muted">Registered Volunteers</div><h4 class="text-dark fw-bold my-1">195</h4><span class="badge bg-success">14 Zones</span></div></div>
                            <div class="col-md-3"><div class="p-3 border rounded-3 bg-light text-center"><div class="small text-muted">On Active Duty Today</div><h4 class="text-primary fw-bold my-1">42 Staff</h4><span class="badge bg-primary">On Schedule</span></div></div>
                            <div class="col-md-3"><div class="p-3 border rounded-3 bg-light text-center"><div class="small text-muted">Field Coordinators</div><h4 class="text-warning fw-bold my-1">18 Leads</h4><span class="badge bg-warning text-dark">Supervisors</span></div></div>
                            <div class="col-md-3"><div class="p-3 border rounded-3 bg-light text-center"><div class="small text-muted">Pending Applications</div><h4 class="text-danger fw-bold my-1">24 Forms</h4><span class="badge bg-danger">Requires Review</span></div></div>
                        </div>

                        <div class="table-responsive">
                            <table class="dash-table table align-middle">
                                <thead><tr><th>Volunteer Name</th><th>Assigned Zone</th><th>Specialty / Skill</th><th>Logged Hours</th><th>Status</th><th class="text-end">Action</th></tr></thead>
                                <tbody>
                                    <tr><td><div class="fw-bold">Captain Dave Miller</div><span class="text-muted" style="font-size: 11px;">Badge: #VOL-001</span></td><td>Sector 7 Coastal</td><td>Disaster Relief Logistics</td><td class="fw-bold text-success">310 hrs</td><td><span class="badge bg-success">On Duty</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Assign Task</a></td></tr>
                                    <tr><td><div class="fw-bold">Elena Rodriguez</div><span class="text-muted" style="font-size: 11px;">Badge: #VOL-048</span></td><td>East Community Warehouse</td><td>Rations Packaging Lead</td><td class="fw-bold text-success">148 hrs</td><td><span class="badge bg-success">Active</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Assign Task</a></td></tr>
                                    <tr><td><div class="fw-bold">Dr. Nathan Hayes</div><span class="text-muted" style="font-size: 11px;">Badge: #VOL-012</span></td><td>St. Jude Clinic Grounds</td><td>Medical Field Screening</td><td class="fw-bold text-success">220 hrs</td><td><span class="badge bg-info text-dark">Shift Tomorrow</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Assign Task</a></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

        case 6:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">Event Operations & Fundraisers</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Manage community rallies, gala evenings, sponsor hospitality, and ticket registration.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-calendar"></i> + Create Charity Event</a>
                    </div>
                    <div class="dash-card-body">
                        <div class="table-responsive">
                            <table class="dash-table table align-middle">
                                <thead><tr><th>Event Title</th><th>Venue Location</th><th>Date & Schedule</th><th>Target Revenue</th><th>Registered Guests</th><th>Status</th><th class="text-end">Manage</th></tr></thead>
                                <tbody>
                                    <tr><td><div class="fw-bold">Annual Charity Gala & Silent Auction</div></td><td>Grand Hyatt Ballroom, NY</td><td>Aug 15, 2026 (7:00 PM)</td><td class="fw-bold text-success">$85,000</td><td>350 / 400 RSVPs</td><td><span class="badge bg-success">Registration Open</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Manage</a></td></tr>
                                    <tr><td><div class="fw-bold">5K Run for Clean Water Wells</div></td><td>City Central Park Pavilion</td><td>Sep 02, 2026 (8:00 AM)</td><td class="fw-bold text-success">$40,000</td><td>1,240 Runners</td><td><span class="badge bg-primary">Ready</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Manage</a></td></tr>
                                    <tr><td><div class="fw-bold">Winter Relief Community Drive</div></td><td>Downtown Civic Center</td><td>Oct 10, 2026 (10:00 AM)</td><td class="fw-bold text-success">$25,000</td><td>180 Volunteers</td><td><span class="badge bg-warning text-dark">Planning</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Manage</a></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

        case 7:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">Financial & Tax Audits (IRS 501(c)(3))</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Official regulatory compliance records, Form 990 filings, and independent CPA audit attestations.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-package"></i> Download Complete Audit Pack</a>
                    </div>
                    <div class="dash-card-body">
                        <div class="alert alert-success d-flex align-items-center gap-2 mb-4">
                            <i class="flaticon-tick"></i>
                            <div><strong>Charitics Public Non-Profit (EIN #94-2819021):</strong> 100% Tax-Exempt Status Verified and Certified by IRS under Section 501(c)(3).</div>
                        </div>

                        <div class="row g-3 mb-4">
                            <div class="col-md-4"><div class="p-3 border rounded-3 bg-light"><h6 class="text-muted">Humanitarian Programs</h6><h3 class="text-success fw-bold">87.2%</h3><p class="text-muted small mb-0">Direct field deployment and relief rations.</p></div></div>
                            <div class="col-md-4"><div class="p-3 border rounded-3 bg-light"><h6 class="text-muted">Administrative Overhead</h6><h3 class="text-primary fw-bold">7.8%</h3><p class="text-muted small mb-0">Operational systems and staff governance.</p></div></div>
                            <div class="col-md-4"><div class="p-3 border rounded-3 bg-light"><h6 class="text-muted">Fundraising Outreach</h6><h3 class="text-secondary fw-bold">5.0%</h3><p class="text-muted small mb-0">Donor drives, public events and marketing.</p></div></div>
                        </div>

                        <div class="table-responsive">
                            <table class="dash-table table align-middle">
                                <thead><tr><th>Fiscal Year</th><th>Audit Firm</th><th>Filing Form</th><th>Independent Opinion</th><th>Status</th><th class="text-end">Document</th></tr></thead>
                                <tbody>
                                    <tr><td><span class="fw-bold">FY 2025</span></td><td>Deloitte & Touche LLP</td><td>IRS Form 990-EO</td><td><span class="badge bg-success">Unqualified Clean Opinion</span></td><td>Certified & Filed</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Download PDF</a></td></tr>
                                    <tr><td><span class="fw-bold">FY 2024</span></td><td>Deloitte & Touche LLP</td><td>IRS Form 990-EO</td><td><span class="badge bg-success">Unqualified Clean Opinion</span></td><td>Certified & Filed</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Download PDF</a></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

        case 8:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">Analytics & Outreach Performance</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Traffic acquisition channels, conversion rates, newsletter reads, and donor retention metrics.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-relationship"></i> Download Analytics Report</a>
                    </div>
                    <div class="dash-card-body">
                        <div class="row g-3 mb-4">
                            <div class="col-md-3"><div class="p-3 border rounded-3 bg-light text-center"><div class="small text-muted">Monthly Page Views</div><h4 class="text-dark fw-bold my-1">148,200</h4><span class="badge bg-success">↑ 24% YoY</span></div></div>
                            <div class="col-md-3"><div class="p-3 border rounded-3 bg-light text-center"><div class="small text-muted">Conversion Rate</div><h4 class="text-primary fw-bold my-1">4.2%</h4><span class="badge bg-primary">Above Average</span></div></div>
                            <div class="col-md-3"><div class="p-3 border rounded-3 bg-light text-center"><div class="small text-muted">Donor Retention</div><h4 class="text-success fw-bold my-1">78.4%</h4><span class="badge bg-success">High Loyalty</span></div></div>
                            <div class="col-md-3"><div class="p-3 border rounded-3 bg-light text-center"><div class="small text-muted">Email Open Rate</div><h4 class="text-secondary fw-bold my-1">38.5%</h4><span class="badge bg-info text-dark">Newsletter</span></div></div>
                        </div>

                        <div class="table-responsive">
                            <table class="dash-table table align-middle">
                                <thead><tr><th>Acquisition Channel</th><th>Sessions</th><th>New Donors</th><th>Total Donations</th><th>ROI Efficiency</th><th class="text-end">Manage</th></tr></thead>
                                <tbody>
                                    <tr><td><span class="fw-bold">Organic Search & Website</span></td><td>62,400</td><td>840 Donors</td><td class="fw-bold text-success">$162,000</td><td><span class="badge bg-success">Very High</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Inspect</a></td></tr>
                                    <tr><td><span class="fw-bold">Corporate Matching Program</span></td><td>14,100</td><td>120 Corporations</td><td class="fw-bold text-success">$210,000</td><td><span class="badge bg-success">Top Tier</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Inspect</a></td></tr>
                                    <tr><td><span class="fw-bold">Social Media Campaigns</span></td><td>48,900</td><td>510 Donors</td><td class="fw-bold text-success">$74,500</td><td><span class="badge bg-primary">High</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Inspect</a></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

        case 9:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">Inquiries & Feedback Desk</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Manage inbound queries from donors, volunteers, grant partners, and the press.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-mail"></i> Mark All as Read</a>
                    </div>
                    <div class="dash-card-body p-0">
                        <div class="table-responsive">
                            <table class="dash-table table align-middle">
                                <thead><tr><th>Ticket ID</th><th>Sender</th><th>Subject Category</th><th>Priority</th><th>Received</th><th class="text-end">Action</th></tr></thead>
                                <tbody>
                                    <tr><td><span class="fw-bold">#INQ-4812</span></td><td>Apex Foundation Board</td><td>Corporate Grant Matching Partnership</td><td><span class="badge bg-danger">Urgent</span></td><td>10 Mins Ago</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-dash-action">Reply</a></td></tr>
                                    <tr><td><span class="fw-bold">#INQ-4809</span></td><td>State University Dean</td><td>Group Volunteer Registration (50 Students)</td><td><span class="badge bg-warning text-dark">High</span></td><td>2 Hours Ago</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-dash-action">Reply</a></td></tr>
                                    <tr><td><span class="fw-bold">#INQ-4801</span></td><td>Eleanor Vance</td><td>Request for 2025 Tax Deduction Duplicate</td><td><span class="badge bg-primary">Normal</span></td><td>Yesterday</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-dash-action">Reply</a></td></tr>
                                    <tr><td><span class="fw-bold">#INQ-4785</span></td><td>Local Press Times</td><td>Interview Request on Flood Relief Outposts</td><td><span class="badge bg-secondary">Media</span></td><td>2 Days Ago</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-dash-action">Reply</a></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

        case 10:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">System Governance & Access Permissions</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Manage platform role-based access control, 2FA security protocols, and system backups.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-settings"></i> + Add System Admin</a>
                    </div>
                    <div class="dash-card-body">
                        <div class="row g-3 mb-4">
                            <div class="col-md-4"><div class="p-3 border rounded-3 bg-light"><div class="small text-muted">Platform Status</div><h5 class="fw-bold text-success my-1">● 100% Operational</h5><span class="text-muted small">Uptime: 99.99%</span></div></div>
                            <div class="col-md-4"><div class="p-3 border rounded-3 bg-light"><div class="small text-muted">Two-Factor Authentication</div><h5 class="fw-bold text-primary my-1">Enforced for Admins</h5><span class="text-muted small">AES-256 Bit Encryption</span></div></div>
                            <div class="col-md-4"><div class="p-3 border rounded-3 bg-light"><div class="small text-muted">Daily Automated Backup</div><h5 class="fw-bold text-dark my-1">Completed Today 04:00 AM</h5><span class="text-muted small">Stored on AWS S3 Glacier</span></div></div>
                        </div>

                        <div class="table-responsive">
                            <table class="dash-table table align-middle">
                                <thead><tr><th>Staff Member</th><th>Role Assigned</th><th>Permissions Scope</th><th>2FA Status</th><th>Last Login</th><th class="text-end">Manage</th></tr></thead>
                                <tbody>
                                    <tr><td><div class="fw-bold">Admin Lead</div><span class="text-muted" style="font-size: 11px;">admin@charitics.org</span></td><td><span class="badge bg-danger">Super Administrator</span></td><td>Full Root Access</td><td><span class="badge bg-success">Active</span></td><td>Just Now</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Edit</a></td></tr>
                                    <tr><td><div class="fw-bold">Marcus Sterling</div><span class="text-muted" style="font-size: 11px;">marcus@charitics.org</span></td><td><span class="badge bg-primary">Finance Auditor</span></td><td>Ledger & Tax Packets</td><td><span class="badge bg-success">Active</span></td><td>Today, 09:15 AM</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Edit</a></td></tr>
                                    <tr><td><div class="fw-bold">Elena Rodriguez</div><span class="text-muted" style="font-size: 11px;">elena@charitics.org</span></td><td><span class="badge bg-warning text-dark">Volunteer Coordinator</span></td><td>Workforce & Rosters</td><td><span class="badge bg-success">Active</span></td><td>Yesterday</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Edit</a></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        default:
            return `<div class="dash-card p-4"><h3>Admin Console</h3></div>`;
    }
}

// ==========================================
// DONOR VIEWS (1 to 10 Dedicated Pages)
// ==========================================
function getDonorViewHTML(num) {
    const auth = getAuth();
    const donorName = auth.name || 'Supporter';

    switch(num) {
        case 1:
            return `
                <div class="dash-card mb-4" style="background: linear-gradient(135deg, #1e252f 0%, #2a3443 100%); color: #fff;">
                    <div class="dash-card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <span class="badge mb-2" style="background: var(--ul-primary, #EB5310); font-size: 12px;">Active Role: DONOR</span>
                            <h2 style="font-weight: 800; font-size: clamp(20px, 2.5vw, 28px); margin: 0;">Welcome, ${donorName}!</h2>
                            <p style="color: #cbd5e1; font-size: 14px; margin-top: 6px; margin-bottom: 0;">
                                Track your philanthropic contributions and humanitarian impact here.
                            </p>
                        </div>
                        <div class="d-flex gap-2">
                            <a href="404.html" class="btn-dash-action"><i class="flaticon-relationship"></i> Make New Donation</a>
                            <a href="404.html" class="btn-dash-action btn-dash-secondary"><i class="flaticon-package"></i> Download Receipts</a>
                        </div>
                    </div>
                </div>

                <div class="row g-3 mb-4">
                    <div class="col-lg-3 col-sm-6">
                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-icon-orange"><i class="flaticon-relationship"></i></div>
                            <div><div class="stat-title">Total Donated</div><div class="stat-val">$14,850</div><div class="stat-meta">↑ 18% this month</div></div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-icon-green"><i class="flaticon-package"></i></div>
                            <div><div class="stat-title">Supported Projects</div><div class="stat-val">24 Causes</div><div class="stat-meta">8 actively funded</div></div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-icon-blue"><i class="flaticon-team"></i></div>
                            <div><div class="stat-title">Lives Impacted</div><div class="stat-val">1,420+</div><div class="stat-meta">Children & Families</div></div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-icon-purple"><i class="flaticon-calendar"></i></div>
                            <div><div class="stat-title">Upcoming Activities</div><div class="stat-val">3 Events</div><div class="stat-meta">Next: July 29th</div></div>
                        </div>
                    </div>
                </div>

                <div class="dash-card">
                    <div class="dash-card-header">
                        <h3 class="dash-card-title">My Recent Contributions & Pledges</h3>
                        <div class="d-flex gap-2">
                            <a href="404.html" class="btn-dash-action btn-dash-secondary"><i class="flaticon-search"></i> Filter Records</a>
                            <a href="404.html" class="btn-dash-action"><i class="flaticon-up-right-arrow"></i> View All Details</a>
                        </div>
                    </div>
                    <div class="dash-card-body p-0">
                        <div class="table-responsive">
                            <table class="dash-table table align-middle">
                                <thead><tr><th>Program / Campaign</th><th>Category</th><th>Contribution</th><th>Status</th><th>Date</th><th class="text-end">Action</th></tr></thead>
                                <tbody>
                                    <tr><td><div class="fw-bold">Clean Water for Rural Schools</div><span class="text-muted" style="font-size: 11px;">ID: #CW-9281</span></td><td>Sanitation & Health</td><td class="fw-bold text-success">$1,200</td><td><span class="badge bg-success">Completed</span></td><td>July 14, 2026</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">View Invoice</a></td></tr>
                                    <tr><td><div class="fw-bold">Emergency Food Supplies</div><span class="text-muted" style="font-size: 11px;">ID: #EF-4102</span></td><td>Hunger Relief</td><td class="fw-bold text-success">$850</td><td><span class="badge bg-primary">In Progress</span></td><td>July 02, 2026</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">View Invoice</a></td></tr>
                                    <tr><td><div class="fw-bold">Children Primary Education Kits</div><span class="text-muted" style="font-size: 11px;">ID: #ED-8819</span></td><td>Education</td><td class="fw-bold text-success">$2,500</td><td><span class="badge bg-success">Completed</span></td><td>June 21, 2026</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">View Invoice</a></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

        case 2:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">My Complete Donation History</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Full permanent ledger of all your individual gifts, bank wires, and card donations.</p>
                        </div>
                        <div class="d-flex gap-2">
                            <a href="404.html" class="btn-dash-action"><i class="flaticon-package"></i> Download All Invoices</a>
                            <a href="404.html" class="btn-dash-action btn-dash-secondary"><i class="flaticon-search"></i> Print Statement</a>
                        </div>
                    </div>
                    <div class="dash-card-body p-0">
                        <div class="table-responsive">
                            <table class="dash-table table align-middle">
                                <thead><tr><th>Receipt No</th><th>Campaign Program</th><th>Gift Amount</th><th>Date</th><th>Tax Deductible</th><th class="text-end">Invoice</th></tr></thead>
                                <tbody>
                                    <tr><td><span class="fw-bold">#RCP-2026-081</span></td><td>Clean Water Solar Wells</td><td class="fw-bold text-success">$1,200.00</td><td>July 14, 2026</td><td><span class="badge bg-success">100% Eligible</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">PDF</a></td></tr>
                                    <tr><td><span class="fw-bold">#RCP-2026-052</span></td><td>Emergency Food Rations</td><td class="fw-bold text-success">$850.00</td><td>July 02, 2026</td><td><span class="badge bg-success">100% Eligible</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">PDF</a></td></tr>
                                    <tr><td><span class="fw-bold">#RCP-2026-039</span></td><td>Student Literacy Scholarships</td><td class="fw-bold text-success">$2,500.00</td><td>June 21, 2026</td><td><span class="badge bg-success">100% Eligible</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">PDF</a></td></tr>
                                    <tr><td><span class="fw-bold">#RCP-2026-015</span></td><td>Mobile Medical Unit Africa</td><td class="fw-bold text-success">$1,750.00</td><td>May 30, 2026</td><td><span class="badge bg-success">100% Eligible</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">PDF</a></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

        case 3:
            return `
                <div class="dash-card mb-4 p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <div>
                            <h3 class="dash-card-title mb-1">Tax Receipts & 501(c)(3) Statements</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Official annual tax-deduction statements certified under IRS Section 501(c)(3).</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-package"></i> Download 2025 Tax Pack (PDF)</a>
                    </div>
                    <div class="row g-3 my-2">
                        <div class="col-md-4"><div class="p-3 border rounded-3 bg-light text-center h-100 d-flex flex-column justify-content-center"><span class="text-muted small">2025 Deductible Total</span><h3 class="text-success fw-bold my-1">$14,850.00</h3><span class="badge bg-success">Statement Ready</span></div></div>
                        <div class="col-md-4"><div class="p-3 border rounded-3 bg-light text-center h-100 d-flex flex-column justify-content-center"><span class="text-muted small">IRS Federal EIN</span><h3 class="fw-bold my-1 text-dark">#94-2819021</h3><span class="badge bg-secondary">Charity Verified</span></div></div>
                        <div class="col-md-4"><div class="p-3 border rounded-3 bg-light text-center h-100 d-flex flex-column justify-content-center"><span class="text-muted small">Accountant Dispatch</span><div class="mt-2"><a href="404.html" class="btn btn-sm btn-dash-secondary">Email to CPA</a></div></div></div>
                    </div>
                    <div class="table-responsive mt-4">
                        <table class="dash-table table align-middle">
                            <thead><tr><th>Year</th><th>Statement Title</th><th>Eligible Amount</th><th>Issuing Organization</th><th class="text-end">Download</th></tr></thead>
                            <tbody>
                                <tr><td><span class="fw-bold">2025</span></td><td>Full Year Donor Tax Certificate</td><td class="text-success fw-bold">$14,850.00</td><td>Charitics NGO Global</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Download PDF</a></td></tr>
                                <tr><td><span class="fw-bold">2024</span></td><td>Full Year Donor Tax Certificate</td><td class="text-success fw-bold">$9,200.00</td><td>Charitics NGO Global</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Download PDF</a></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

        case 4:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">Explore Urgent Causes Needing Help</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">High-priority field projects with immediate funding shortfalls.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-relationship"></i> Make Emergency Donation</a>
                    </div>
                    <div class="dash-card-body">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <div class="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                                    <div>
                                        <span class="badge bg-danger mb-2">Critical Need</span>
                                        <h5>Horn of Africa Drought Rations</h5>
                                        <p class="text-muted small">Emergency high-energy biscuits and clean water tanks for 5,000 children.</p>
                                        <div class="progress mb-2" style="height: 8px;"><div class="progress-bar bg-danger" style="width: 75%;"></div></div>
                                        <div class="d-flex justify-content-between small text-muted mb-3"><span>$75,000</span><span>Goal: $100,000</span></div>
                                    </div>
                                    <a href="404.html" class="btn btn-sm btn-dash-action w-100 justify-content-center">Donate to this Cause</a>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                                    <div>
                                        <span class="badge bg-warning text-dark mb-2">Active Drive</span>
                                        <h5>Refugee Child Winter Jackets</h5>
                                        <p class="text-muted small">Thermal insulation blankets, waterproof jackets, and boots for refugee camps.</p>
                                        <div class="progress mb-2" style="height: 8px;"><div class="progress-bar bg-warning" style="width: 60%;"></div></div>
                                        <div class="d-flex justify-content-between small text-muted mb-3"><span>$30,000</span><span>Goal: $50,000</span></div>
                                    </div>
                                    <a href="404.html" class="btn btn-sm btn-dash-action w-100 justify-content-center">Donate to this Cause</a>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                                    <div>
                                        <span class="badge bg-primary mb-2">Community</span>
                                        <h5>Vocational Laptops for Girls</h5>
                                        <p class="text-muted small">Equipping 120 young women with refurbished laptops and coding bootcamp tuition.</p>
                                        <div class="progress mb-2" style="height: 8px;"><div class="progress-bar bg-primary" style="width: 85%;"></div></div>
                                        <div class="d-flex justify-content-between small text-muted mb-3"><span>$34,000</span><span>Goal: $40,000</span></div>
                                    </div>
                                    <a href="404.html" class="btn btn-sm btn-dash-action w-100 justify-content-center">Donate to this Cause</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        case 5:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">Recurring Gifts & Monthly Pledges</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Manage your automated recurring donations, adjust amounts, or update payment schedules.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-relationship"></i> + Setup New Monthly Gift</a>
                    </div>
                    <div class="dash-card-body">
                        <div class="row g-3 mb-4">
                            <div class="col-md-6">
                                <div class="p-4 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h5 class="mb-0">Clean Water Wells Monthly Patron</h5>
                                        <span class="badge bg-success">Active Subscription</span>
                                    </div>
                                    <h3 class="text-success fw-bold my-2">$150.00 <span style="font-size: 14px; font-weight: 500; color: #6b7280;">/ month</span></h3>
                                    <p class="text-muted small mb-3">Billing via Visa ending in 4092. Next scheduled draft: October 1, 2026.</p>
                                    <div class="d-flex gap-2 mt-auto pt-2">
                                        <a href="404.html" class="btn btn-sm btn-dash-action">Change Amount</a>
                                        <a href="404.html" class="btn btn-sm btn-outline-secondary">Pause Subscription</a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-4 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h5 class="mb-0">Children Food Rations Quarterly Pledge</h5>
                                        <span class="badge bg-primary">Active Subscription</span>
                                    </div>
                                    <h3 class="text-primary fw-bold my-2">$500.00 <span style="font-size: 14px; font-weight: 500; color: #6b7280;">/ quarter</span></h3>
                                    <p class="text-muted small mb-3">Billing via Direct Bank ACH. Next scheduled draft: November 15, 2026.</p>
                                    <div class="d-flex gap-2 mt-auto pt-2">
                                        <a href="404.html" class="btn btn-sm btn-dash-action">Change Amount</a>
                                        <a href="404.html" class="btn btn-sm btn-outline-secondary">Pause Subscription</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        case 6:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">My Humanitarian Impact & Lives Touched</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Verified field reports and photographic documentation powered by your donations.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-user"></i> Download Impact Summary</a>
                    </div>
                    <div class="dash-card-body">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <div class="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                                    <div>
                                        <span class="badge bg-success mb-2">Infrastructure</span>
                                        <h5>Clean Water Borewell #14</h5>
                                        <p class="text-muted small">Successfully drilled in Village Solai. Provides clean, disease-free drinking water to 480 families daily.</p>
                                        <div class="text-muted small fw-bold">Impact: 480 Lives Touched</div>
                                    </div>
                                    <div class="mt-3"><a href="404.html" class="btn btn-sm btn-outline-secondary w-100">View Field Photos</a></div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                                    <div>
                                        <span class="badge bg-primary mb-2">Education</span>
                                        <h5>120 School Uniforms & Kits</h5>
                                        <p class="text-muted small">Delivered to St. Jude Elementary. Enabled 120 girls to attend full-day primary classes with text supplies.</p>
                                        <div class="text-muted small fw-bold">Impact: 120 Students Enrolled</div>
                                    </div>
                                    <div class="mt-3"><a href="404.html" class="btn btn-sm btn-outline-secondary w-100">View Field Photos</a></div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                                    <div>
                                        <span class="badge bg-warning text-dark mb-2">Nutrition</span>
                                        <h5>3,500 Nutritious Meals Cooked</h5>
                                        <p class="text-muted small">Prepared and delivered across 4 emergency shelters following seasonal coastal flooding.</p>
                                        <div class="text-muted small fw-bold">Impact: 820 Children Fed</div>
                                    </div>
                                    <div class="mt-3"><a href="404.html" class="btn btn-sm btn-outline-secondary w-100">View Field Photos</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        case 7:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">VIP Events & Gala Invitations</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Exclusive invitations, annual director dinners, and special field briefing sessions.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-calendar"></i> View Events Calendar</a>
                    </div>
                    <div class="dash-card-body">
                        <div class="table-responsive">
                            <table class="dash-table table align-middle">
                                <thead><tr><th>Event Title</th><th>Venue / Format</th><th>Date</th><th>RSVP Status</th><th>VIP Tier</th><th class="text-end">Manage</th></tr></thead>
                                <tbody>
                                    <tr><td><div class="fw-bold">Annual Benefactor Gala Dinner</div></td><td>Grand Hyatt Ballroom, NY</td><td>Aug 15, 2026 (7:00 PM)</td><td><span class="badge bg-success">Confirmed (2 Guests)</span></td><td><span class="badge bg-warning text-dark">Gold VIP Pass</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-dash-action">Download Pass</a></td></tr>
                                    <tr><td><div class="fw-bold">Live Field Briefing: Clean Water Wells</div></td><td>Executive Virtual Zoom</td><td>Oct 05, 2026 (5:00 PM EST)</td><td><span class="badge bg-primary">Registered</span></td><td><span class="badge bg-info text-dark">Private Stream</span></td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Join Link</a></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

        case 8:
            return `
                <div class="dash-card mb-4 p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <div>
                            <h3 class="dash-card-title mb-1">Donor Honors & Giving Badges</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Your philanthropic ranking, unlocked milestone badges, and civic honors.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-tick"></i> Share Honor on LinkedIn</a>
                    </div>
                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <div class="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                                <div>
                                    <span class="text-muted small">Current Honor Level</span>
                                    <h3 class="text-warning fw-bold my-1">Gold Benefactor <span class="badge bg-warning text-dark">Level 4</span></h3>
                                    <p class="text-muted small mb-2">You are in the top 3% of supporters nationwide!</p>
                                    <div class="progress mb-2" style="height: 10px;"><div class="progress-bar bg-warning" style="width: 74%;"></div></div>
                                </div>
                                <div class="small text-muted mt-2">$5,150 remaining to unlock Platinum Champion tier.</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="p-3 border rounded-3 bg-light h-100 d-flex flex-column">
                                <span class="text-muted small">Unlocked Achievements</span>
                                <div class="d-flex gap-2 flex-wrap mt-2">
                                    <span class="badge bg-success p-2"><i class="flaticon-relationship"></i> First Mile Supporter</span>
                                    <span class="badge bg-primary p-2"><i class="flaticon-package"></i> Clean Water Guardian</span>
                                    <span class="badge bg-info text-dark p-2"><i class="flaticon-calendar"></i> 1-Year Continuous Giver</span>
                                    <span class="badge bg-danger p-2"><i class="flaticon-telephone-call-1"></i> Crisis Rapid Responder</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        case 9:
            return `
                <div class="dash-card mb-4 p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <div>
                            <h3 class="dash-card-title mb-1">Dedicated Charity Officer Support</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Direct private communication channel with your assigned senior giving officer.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-mail"></i> Schedule Video Consultation</a>
                    </div>
                    <div class="row g-3 my-2">
                        <div class="col-md-4">
                            <div class="p-4 border rounded-3 bg-light text-center h-100 d-flex flex-column justify-content-center">
                                <div class="dash-user-avatar mx-auto mb-2" style="width: 50px; height: 50px; font-size: 20px;">S</div>
                                <h5 class="mb-1">Dr. Sarah Jenkins</h5>
                                <div class="text-muted small mb-2">Senior Giving Officer</div>
                                <span class="badge bg-success mb-3">Online Now</span>
                                <div class="text-muted small">sarah.jenkins@charitics.org</div>
                                <div class="text-muted small">+1 (800) 492-8100 ext 44</div>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="p-4 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                                <div>
                                    <h5 class="mb-3">Send Direct Inquiry to Sarah</h5>
                                    <div class="mb-3">
                                        <textarea class="form-control" rows="4" placeholder="Ask questions about fund allocations, program receipts, or corporate matching grants..."></textarea>
                                    </div>
                                </div>
                                <a href="404.html" class="btn btn-dash-action" style="align-self: flex-start;"><i class="flaticon-mail"></i> Send Priority Message</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        case 10:
            return `
                <div class="dash-card mb-4 p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <div>
                            <h3 class="dash-card-title mb-1">Payment Methods & Anonymity Settings</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Control your payment cards, bank wire links, and privacy settings on public walls.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-settings"></i> + Add Payment Method</a>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                                <div>
                                    <h6 class="fw-bold mb-3">Saved Payment Methods</h6>
                                    <div class="p-2 border rounded-2 bg-white mb-2 d-flex justify-content-between align-items-center">
                                        <div><i class="flaticon-package text-primary me-2"></i> <strong>Visa ending in 4092</strong> <span class="badge bg-success ms-2">Default</span></div>
                                        <a href="404.html" class="btn btn-sm btn-outline-danger">Remove</a>
                                    </div>
                                    <div class="p-2 border rounded-2 bg-white d-flex justify-content-between align-items-center">
                                        <div><i class="flaticon-settings text-secondary me-2"></i> <strong>ACH Direct Check (Chase)</strong></div>
                                        <a href="404.html" class="btn btn-sm btn-outline-danger">Remove</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                                <div>
                                    <h6 class="fw-bold mb-3">Donor Privacy & Anonymity</h6>
                                    <div class="form-check form-switch mb-3">
                                        <input class="form-check-input" type="checkbox" id="anonCheck">
                                        <label class="form-check-label" for="anonCheck"><strong>Give Anonymously</strong> (Do not display my full name on public campaign donor lists)</label>
                                    </div>
                                    <div class="form-check form-switch mb-3">
                                        <input class="form-check-input" type="checkbox" id="emailCheck" checked>
                                        <label class="form-check-label" for="emailCheck">Receive Quarterly Impact Magazine & Field Photos</label>
                                    </div>
                                </div>
                                <div class="mt-2">
                                    <a href="404.html" class="btn btn-sm btn-dash-action">Save Privacy Preferences</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        default:
            return `<div class="dash-card p-4"><h3>Donor Portal</h3></div>`;
    }
}

// ==========================================
// VOLUNTEER VIEWS (1 to 10 Dedicated Pages)
// ==========================================
function getVolunteerViewHTML(num) {
    const auth = getAuth();
    const volunteerName = auth.name || 'Volunteer';

    switch(num) {
        case 1:
            return `
                <div class="dash-card mb-4" style="background: linear-gradient(135deg, #1e252f 0%, #2a3443 100%); color: #fff;">
                    <div class="dash-card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <span class="badge mb-2" style="background: var(--ul-primary, #EB5310); font-size: 12px;">Active Role: VOLUNTEER</span>
                            <h2 style="font-weight: 800; font-size: clamp(20px, 2.5vw, 28px); margin: 0;">Welcome, ${volunteerName}!</h2>
                            <p style="color: #cbd5e1; font-size: 14px; margin-top: 6px; margin-bottom: 0;">
                                Your field schedule, volunteer service hours, and assigned relief campaigns.
                            </p>
                        </div>
                        <div class="d-flex gap-2">
                            <a href="404.html" class="btn-dash-action"><i class="flaticon-tick"></i> Submit Time Log</a>
                            <a href="404.html" class="btn-dash-action btn-dash-secondary"><i class="flaticon-calendar"></i> View Monthly Roster</a>
                        </div>
                    </div>
                </div>

                <div class="row g-3 mb-4">
                    <div class="col-lg-3 col-sm-6">
                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-icon-orange"><i class="flaticon-package"></i></div>
                            <div><div class="stat-title">Volunteer Hours</div><div class="stat-val">148 Hours</div><div class="stat-meta">Verified by supervisor</div></div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-icon-green"><i class="flaticon-tick"></i></div>
                            <div><div class="stat-title">Assigned Tasks</div><div class="stat-val">12 Completed</div><div class="stat-meta">2 upcoming this week</div></div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-icon-blue"><i class="flaticon-team"></i></div>
                            <div><div class="stat-title">Families Supported</div><div class="stat-val">380 Families</div><div class="stat-meta">Disaster relief food & aid</div></div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="stat-card">
                            <div class="stat-icon-wrapper stat-icon-purple"><i class="flaticon-calendar"></i></div>
                            <div><div class="stat-title">Next Field Shift</div><div class="stat-val">Tomorrow 9 AM</div><div class="stat-meta">East Community Warehouse</div></div>
                        </div>
                    </div>
                </div>

                <div class="dash-card">
                    <div class="dash-card-header">
                        <h3 class="dash-card-title">My Assigned Field Tasks & Shifts</h3>
                        <div class="d-flex gap-2">
                            <a href="404.html" class="btn-dash-action btn-dash-secondary"><i class="flaticon-calendar"></i> Shift Calendar</a>
                            <a href="404.html" class="btn-dash-action"><i class="flaticon-up-right-arrow"></i> View Details</a>
                        </div>
                    </div>
                    <div class="dash-card-body p-0">
                        <div class="table-responsive">
                            <table class="dash-table table align-middle">
                                <thead><tr><th>Field Assignment / Task</th><th>Relief Center / Venue</th><th>Shift Schedule</th><th>Status</th><th>Supervisor</th><th class="text-end">Action</th></tr></thead>
                                <tbody>
                                    <tr><td><div class="fw-bold">Food Ration Package Sorting</div><span class="text-muted" style="font-size: 11px;">Task ID: #VOL-TS89</span></td><td>East Community Warehouse, Bay 3</td><td class="fw-bold text-primary">Tomorrow, 9:00 AM - 1:00 PM</td><td><span class="badge bg-warning text-dark">Upcoming Shift</span></td><td>Captain Dave Miller</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Check-in</a></td></tr>
                                    <tr><td><div class="fw-bold">School Supply Kit Distribution</div><span class="text-muted" style="font-size: 11px;">Task ID: #VOL-TS72</span></td><td>Greenwood Public School Center</td><td class="fw-bold text-success">July 18 (Completed 4.5 hrs)</td><td><span class="badge bg-success">Verified</span></td><td>Sister Mary Angela</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">View Log</a></td></tr>
                                    <tr><td><div class="fw-bold">Medical Camp Crowd Assistance</div><span class="text-muted" style="font-size: 11px;">Task ID: #VOL-TS55</span></td><td>St. Jude Clinic Grounds</td><td class="fw-bold text-success">July 10 (Completed 6.0 hrs)</td><td><span class="badge bg-success">Verified</span></td><td>Dr. Nathan Hayes</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">View Log</a></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

        case 2:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">My Assigned Field Tasks & Checklists</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Review your assigned humanitarian field duties, completion signoffs, and safety procedures.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-tick"></i> Request Task Reassignment</a>
                    </div>
                    <div class="dash-card-body p-0">
                        <div class="table-responsive">
                            <table class="dash-table table align-middle">
                                <thead><tr><th>Task Description</th><th>Field Zone</th><th>Priority</th><th>Due Time</th><th>Verification</th><th class="text-end">Action</th></tr></thead>
                                <tbody>
                                    <tr><td><div class="fw-bold">Organize 150 Medical Emergency Kits</div></td><td>Zone 4 Warehouse</td><td><span class="badge bg-danger">Urgent</span></td><td>Tomorrow 12:00 PM</td><td>Pending Supervisor Signoff</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-dash-action">Mark Done</a></td></tr>
                                    <tr><td><div class="fw-bold">Lead Registration for 5K Charity Run</div></td><td>City Park Pavilion</td><td><span class="badge bg-primary">Normal</span></td><td>Saturday 8:00 AM</td><td>Coordinator Confirmed</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Check-in</a></td></tr>
                                    <tr><td><div class="fw-bold">Pack 300 School Backpacks</div></td><td>Warehouse B</td><td><span class="badge bg-success">Completed</span></td><td>July 18</td><td>Signed off by Sister Mary</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">View Signoff</a></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

        case 3:
            return `
                <div class="dash-card mb-4 p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <div>
                            <h3 class="dash-card-title mb-1">Official Hours Timesheet & Service Letter</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Certified community service logs for academic, corporate matching, or civic credits.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-package"></i> Download Certified Timesheet PDF</a>
                    </div>
                    <div class="row g-3 my-2">
                        <div class="col-md-4"><div class="p-3 border rounded-3 bg-light text-center"><span class="text-muted small">Total Certified Hours</span><h3 class="text-primary fw-bold my-1">148.5 Hours</h3><span class="badge bg-success">Fully Verified</span></div></div>
                        <div class="col-md-4"><div class="p-3 border rounded-3 bg-light text-center"><span class="text-muted small">Field Shifts Completed</span><h3 class="fw-bold my-1 text-dark">28 Shifts</h3><span class="badge bg-info text-dark">Gold Honor Level</span></div></div>
                        <div class="col-md-4"><div class="p-3 border rounded-3 bg-light text-center"><span class="text-muted small">Supervisor Attestation</span><div class="mt-2"><a href="404.html" class="btn btn-sm btn-dash-secondary">Request Letter</a></div></div></div>
                    </div>
                    <div class="table-responsive mt-4">
                        <table class="dash-table table align-middle">
                            <thead><tr><th>Shift Date</th><th>Mission / Program</th><th>Location</th><th>Hours Logged</th><th>Supervisor Signature</th><th class="text-end">Certificate</th></tr></thead>
                            <tbody>
                                <tr><td>July 18, 2026</td><td>School Supply Distribution</td><td>Greenwood Center</td><td class="fw-bold text-success">4.5 Hours</td><td>Sister Mary Angela</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">PDF</a></td></tr>
                                <tr><td>July 10, 2026</td><td>Medical Camp Crowd Assistance</td><td>St. Jude Clinic</td><td class="fw-bold text-success">6.0 Hours</td><td>Dr. Nathan Hayes</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">PDF</a></td></tr>
                                <tr><td>June 28, 2026</td><td>Disaster Flood Relief Packing</td><td>Zone 4 Warehouse</td><td class="fw-bold text-success">8.0 Hours</td><td>Captain Dave Miller</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">PDF</a></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

        case 4:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">Upcoming Shifts & Monthly Roster</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Browse open field volunteer opportunities and claim slots on the schedule.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-calendar"></i> Sync with Calendar</a>
                    </div>
                    <div class="dash-card-body">
                        <div class="table-responsive">
                            <table class="dash-table table align-middle">
                                <thead><tr><th>Date & Time</th><th>Relief Activity</th><th>Location Venue</th><th>Spots Remaining</th><th>Requirement</th><th class="text-end">Claim Slot</th></tr></thead>
                                <tbody>
                                    <tr><td><div class="fw-bold">Tomorrow, 9:00 AM - 1:00 PM</div></td><td>Rations Packing</td><td>East Community Warehouse</td><td><span class="badge bg-warning text-dark">4 Spots Open</span></td><td>Lifting up to 25 lbs</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-dash-action">Join Shift</a></td></tr>
                                    <tr><td><div class="fw-bold">Saturday, 8:00 AM - 2:00 PM</div></td><td>5K Marathon Water Station</td><td>Central City Park</td><td><span class="badge bg-success">Confirmed Assigned</span></td><td>Water Distribution</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">View Details</a></td></tr>
                                    <tr><td><div class="fw-bold">Sunday, 10:00 AM - 3:00 PM</div></td><td>Community Meal Kitchen</td><td>Civic Center Hub</td><td><span class="badge bg-danger">2 Spots Left</span></td><td>Food Prep & Serving</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-dash-action">Join Shift</a></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

        case 5:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">Disaster Relief Camps & Rapid Deployments</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Critical response basecamps and humanitarian frontline relief zones.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-relationship"></i> Volunteer for Deployment</a>
                    </div>
                    <div class="dash-card-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <div class="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                                    <div>
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <h5 class="mb-0">Sector 7 Coastal Flood Camp</h5>
                                            <span class="badge bg-danger">Active Emergency</span>
                                        </div>
                                        <p class="text-muted small">Providing daily rations, water purifying tablets, and shelter kits to 1,200 displaced families.</p>
                                        <div class="small text-muted mb-3">Coordinator: Captain Dave Miller | Radio: Channel 4</div>
                                    </div>
                                    <div class="d-flex gap-2 mt-auto">
                                        <a href="404.html" class="btn btn-sm btn-dash-action">Join Relief Squad</a>
                                        <a href="404.html" class="btn btn-sm btn-outline-secondary">Camp Manual</a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                                    <div>
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <h5 class="mb-0">North District Cold Weather Shelter</h5>
                                            <span class="badge bg-primary">Seasonal Readiness</span>
                                        </div>
                                        <p class="text-muted small">Emergency overnight beds, warm soup kitchen, and medical triage for homeless individuals.</p>
                                        <div class="small text-muted mb-3">Coordinator: Elena Rodriguez | Civic Center Annex</div>
                                    </div>
                                    <div class="d-flex gap-2 mt-auto">
                                        <a href="404.html" class="btn btn-sm btn-dash-action">Join Relief Squad</a>
                                        <a href="404.html" class="btn btn-sm btn-outline-secondary">Camp Manual</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        case 6:
            return `
                <div class="dash-card mb-4 p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <div>
                            <h3 class="dash-card-title mb-1">Volunteer Certifications & Skill Badges</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Official qualifications, safety training compliance, and civic leadership credentials.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-up-right-arrow"></i> Enroll in New Training</a>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="p-3 border rounded-3 bg-light text-center h-100 d-flex flex-column justify-content-between">
                                <div>
                                    <i class="flaticon-tick text-success" style="font-size: 32px;"></i>
                                    <h5 class="mt-2 mb-1">First Aid & CPR Certified</h5>
                                    <span class="badge bg-success">Valid through Dec 2027</span>
                                </div>
                                <div class="mt-3"><a href="404.html" class="btn btn-sm btn-outline-secondary">Download PDF</a></div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="p-3 border rounded-3 bg-light text-center h-100 d-flex flex-column justify-content-between">
                                <div>
                                    <i class="flaticon-relationship text-primary" style="font-size: 32px;"></i>
                                    <h5 class="mt-2 mb-1">Child Safeguarding Level 2</h5>
                                    <span class="badge bg-primary">Certified</span>
                                </div>
                                <div class="mt-3"><a href="404.html" class="btn btn-sm btn-outline-secondary">Download PDF</a></div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="p-3 border rounded-3 bg-light text-center h-100 d-flex flex-column justify-content-between">
                                <div>
                                    <i class="flaticon-package text-warning" style="font-size: 32px;"></i>
                                    <h5 class="mt-2 mb-1">Disaster Relief Logistics</h5>
                                    <span class="badge bg-warning text-dark">In Progress (80%)</span>
                                </div>
                                <div class="mt-3"><a href="404.html" class="btn btn-sm btn-dash-action">Resume Course</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        case 7:
            return `
                <div class="dash-card mb-4">
                    <div class="dash-card-header">
                        <div>
                            <h3 class="dash-card-title">Field Team Directory & Coordinators</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Connect with fellow team volunteers, zone supervisors, and dispatchers.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-team"></i> Message Coordinator</a>
                    </div>
                    <div class="dash-card-body p-0">
                        <div class="table-responsive">
                            <table class="dash-table table align-middle">
                                <thead><tr><th>Member</th><th>Role / Assignment</th><th>Duty Zone</th><th>Contact</th><th class="text-end">Direct Message</th></tr></thead>
                                <tbody>
                                    <tr><td><div class="fw-bold">Captain Dave Miller</div></td><td>Field Supervisor</td><td>Sector 7 Coastal Relief</td><td>d.miller@charitics.org</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Chat</a></td></tr>
                                    <tr><td><div class="fw-bold">Elena Rodriguez</div></td><td>Warehouse Logistics Lead</td><td>East Community Warehouse</td><td>elena.r@charitics.org</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Chat</a></td></tr>
                                    <tr><td><div class="fw-bold">Dr. Nathan Hayes</div></td><td>Medical Outreach Lead</td><td>St. Jude Clinic Grounds</td><td>nathan.h@charitics.org</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Chat</a></td></tr>
                                    <tr><td><div class="fw-bold">Sister Mary Angela</div></td><td>Community Outreach Coordinator</td><td>Greenwood Center</td><td>mary.a@charitics.org</td><td class="text-end"><a href="404.html" class="btn btn-sm btn-outline-secondary">Chat</a></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

        case 8:
            return `
                <div class="dash-card mb-4 p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <div>
                            <h3 class="dash-card-title mb-1">Emergency Field Bulletins & Alerts</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Urgent operational alerts, weather hazard advisories, and flash supply calls.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-telephone-call-1"></i> Acknowledge All</a>
                    </div>
                    <div class="alert alert-danger d-flex align-items-center gap-2 mb-3">
                        <i class="flaticon-telephone-call-1" style="font-size: 20px;"></i>
                        <div><strong>🚨 FLASH CALL (Zone 4):</strong> 10 additional volunteers desperately needed tomorrow morning at Central Food Bank due to emergency flood shipments.</div>
                    </div>
                    <div class="alert alert-warning d-flex align-items-center gap-2 mb-4">
                        <i class="flaticon-settings" style="font-size: 20px;"></i>
                        <div><strong>⚠️ WEATHER WARNING:</strong> Heavy coastal rain expected Friday. All mobile medical units must shift inside Greenwood School Hall.</div>
                    </div>
                    <div class="d-flex gap-2">
                        <a href="404.html" class="btn btn-dash-action">Respond to Emergency Deployment</a>
                        <a href="404.html" class="btn btn-dash-secondary">View Alert History</a>
                    </div>
                </div>
            `;

        case 9:
            return `
                <div class="dash-card mb-4 p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <div>
                            <h3 class="dash-card-title mb-1">Supervisor Chat & Field Inbox</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Direct message communication with Captain Dave Miller and zone leads.</p>
                        </div>
                        <span class="badge bg-success">Supervisor Online</span>
                    </div>
                    <div class="border rounded-3 p-3 bg-light mb-3" style="max-height: 250px; overflow-y: auto;">
                        <div class="mb-2"><strong>Captain Dave Miller:</strong> <span class="text-muted small">09:14 AM</span><div class="p-2 rounded bg-white mt-1">Good morning team! Please remember your steel-toe boots for tomorrow's shift in Bay 3.</div></div>
                        <div class="mb-2 text-end"><strong>You:</strong> <span class="text-muted small">09:20 AM</span><div class="p-2 rounded bg-primary text-white mt-1 d-inline-block">Understood Captain! Roster says 9:00 AM start, will be there on time.</div></div>
                    </div>
                    <div class="d-flex gap-2">
                        <input type="text" class="form-control" placeholder="Type a message to your supervisor...">
                        <a href="404.html" class="btn btn-dash-action">Send</a>
                    </div>
                </div>
            `;

        case 10:
            return `
                <div class="dash-card mb-4 p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <div>
                            <h3 class="dash-card-title mb-1">Availability & Volunteer Profile</h3>
                            <p class="text-muted mb-0" style="font-size: 13px;">Update your weekly availability, emergency contact, uniform size, and preferred zones.</p>
                        </div>
                        <a href="404.html" class="btn-dash-action"><i class="flaticon-settings"></i> Save Changes</a>
                    </div>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                                <div>
                                    <h6 class="fw-bold mb-3">Available Days & Shifts</h6>
                                    <div class="form-check mb-2"><input class="form-check-input" type="checkbox" id="mon" checked><label class="form-check-label" for="mon">Mondays (Morning / Afternoon)</label></div>
                                    <div class="form-check mb-2"><input class="form-check-input" type="checkbox" id="wed" checked><label class="form-check-label" for="wed">Wednesdays (Morning / Afternoon)</label></div>
                                    <div class="form-check mb-2"><input class="form-check-input" type="checkbox" id="sat" checked><label class="form-check-label" for="sat">Saturdays (Full Day)</label></div>
                                    <div class="form-check"><input class="form-check-input" type="checkbox" id="sun"><label class="form-check-label" for="sun">Sundays (Emergency Only)</label></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="p-3 border rounded-3 bg-light h-100 d-flex flex-column justify-content-between">
                                <div>
                                    <h6 class="fw-bold mb-3">Emergency Contact & Gear</h6>
                                    <div class="mb-2"><span class="small text-muted">Emergency Contact:</span> <strong>Dr. Robert Vance (+1 555-0192)</strong></div>
                                    <div class="mb-2"><span class="small text-muted">Volunteer T-Shirt Size:</span> <strong>Adult L (Issued)</strong></div>
                                    <div class="mb-2"><span class="small text-muted">Driver's License:</span> <strong>Class C (Valid)</strong></div>
                                </div>
                                <div class="mt-3"><a href="404.html" class="btn btn-sm btn-outline-secondary">Update Emergency Contact</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        default:
            return `<div class="dash-card p-4"><h3>Volunteer Hub</h3></div>`;
    }
}

// Role switching handler
function switchRole(role) {
    const auth = getAuth();
    auth.role = role;
    auth.isLoggedIn = true;
    localStorage.setItem('charitics_auth', JSON.stringify(auth));
    currentRole = role;
    currentActiveItem = 1;

    applyRoleData(role, auth.name);
    renderSidebar(role);
    renderMainView(role, 1);
}

function applyRoleData(role, name) {
    const roleBadge = document.getElementById('active-role-badge');
    const roleText = document.getElementById('role-text');
    const userDisplayName = document.getElementById('user-display-name');
    const userAvatar = document.getElementById('user-avatar');

    const cleanName = name || (role.charAt(0).toUpperCase() + role.slice(1));
    if (userDisplayName) userDisplayName.textContent = cleanName;
    if (userAvatar) userAvatar.textContent = cleanName.charAt(0).toUpperCase();

    if (roleBadge && roleText) {
        roleBadge.className = `role-badge ${role}`;
        roleText.textContent = role.toUpperCase();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.position = 'static';
    document.body.style.overflowY = 'auto';
    const auth = getAuth();

    // Determine role from URL or auth
    const urlParams = new URLSearchParams(window.location.search);
    const paramRole = urlParams.get('role');
    currentRole = paramRole || auth.role || 'donor';
    const currentName = auth.name || (currentRole.charAt(0).toUpperCase() + currentRole.slice(1));

    if (!auth.isLoggedIn) {
        localStorage.setItem('charitics_auth', JSON.stringify({
            isLoggedIn: true,
            role: currentRole,
            name: currentName,
            email: auth.email || `${currentRole}@charitics.org`
        }));
    }

    applyRoleData(currentRole, currentName);
    renderSidebar(currentRole);
    renderMainView(currentRole, currentActiveItem);

    // Mobile Hamburger
    const hamburgerBtn = document.getElementById('dash-hamburger-btn');
    const backdrop = document.getElementById('dash-backdrop');

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMobileSidebar);
    if (backdrop) backdrop.addEventListener('click', closeMobileSidebar);

    // Logout
    const logoutBtn = document.getElementById('btn-dash-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('charitics_auth');
            window.location.href = 'login.html';
        });
    }

    // Logo click in dashboard goes to first link (item 1) instead of index.html
    const brandLogo = document.getElementById('dash-brand-logo');
    if (brandLogo) {
        brandLogo.addEventListener('click', (e) => {
            e.preventDefault();
            selectSidebarItem(e, 1);
        });
    }

    // Intercept action buttons inside dashboard to go to 404.html
    // CRITICAL: SIDEBAR, TOPBAR, AND BACKDROP ARE EXCLUDED!
    // SIDEBAR CLICKS ALWAYS STAY IN DASHBOARD AND SWITCH VIEWS!
    document.addEventListener('click', (e) => {
        // Exclude entire sidebar, topbar, and backdrop
        if (e.target.closest('.dash-sidebar, .dash-topbar, #dash-backdrop')) {
            return;
        }

        // Exclude sidebar navigation links specifically
        if (e.target.closest('.dash-nav-link')) {
            return;
        }

        // Any action button inside dashboard main views navigates to 404.html
        const actionBtn = e.target.closest('.btn-dash-action, .btn-dash-secondary, .btn-outline-secondary, .btn-outline-danger, button[type="submit"]');
        if (actionBtn) {
            e.preventDefault();
            window.location.href = '404.html';
        }
    });
});

// Expose key objects & functions globally on window
if (typeof window !== 'undefined') {
    window.SIDEBAR_CONFIGS = SIDEBAR_CONFIGS;
    window.selectSidebarItem = selectSidebarItem;
    window.switchRole = switchRole;
    window.renderSidebar = renderSidebar;
    window.renderMainView = renderMainView;
    window.closeMobileSidebar = closeMobileSidebar;
    window.openMobileSidebar = openMobileSidebar;
    window.toggleMobileSidebar = toggleMobileSidebar;
    window.getAdminViewHTML = getAdminViewHTML;
    window.getDonorViewHTML = getDonorViewHTML;
    window.getVolunteerViewHTML = getVolunteerViewHTML;
}
