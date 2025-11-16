import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";


const API_BASE = "http://localhost:5000/api";

function apiClient(token) {
  return axios.create({
    baseURL: API_BASE,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}


function IconMenu() {
  return (
    <svg className="w-5 h-5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={
        "bg-white/60 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-lg " +
        className
      }
    >
      {children}
    </div>
  );
}

/* ---------- Single-file app component ---------- */

export default function AdminPanel() {
  const [view, setView] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? "/" : "login";
  });
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  // data stores
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // simple view guard
  useEffect(() => {
    if (!token) {
      setView("login");
    } else if (view === "login") {
      setView("/");
    }
  }, [token]);

  // fetch functions
  const fetchStats = async () => {
    try {
      const res = await apiClient(token).get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("stats err", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await apiClient(token).get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("users err", err);
    }
  };

  const fetchHosts = async () => {
    try {
      const res = await apiClient(token).get("/admin/hosts");
      setHosts(res.data || []);
    } catch (err) {
      console.error("hosts err", err);
    }
  };

  const fetchCars = async () => {
    try {
      const res = await apiClient(token).get("/admin/cars");
      setCars(res.data || []);
    } catch (err) {
      console.error("cars err", err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await apiClient(token).get("/admin/bookings");
      setBookings(res.data || []);
    } catch (err) {
      console.error("bookings err", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await apiClient(token).get("/admin/messages");
      setMessages(res.data || []);
    } catch (err) {
      console.error("messages err", err);
    }
  };

  // load appropriate data when view changes
  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      try {
        if (view === "/") await fetchStats();
        if (view === "users") await fetchUsers();
        if (view === "hosts") await fetchHosts();
        if (view === "cars") await fetchCars();
        if (view === "bookings") await fetchBookings();
        if (view === "messages") await fetchMessages();
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, token]);

  // login handler
  const handleLogin = async (email, password) => {
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      const payload = res.data;
      if (!payload.token) throw new Error("No token in response");
      localStorage.setItem("token", payload.token);
      localStorage.setItem("user", JSON.stringify(payload.user));
      setToken(payload.token);
      setUser(payload.user);
      setView("/");
    } catch (err) {
      console.error(err);
      setLoginError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  // logout
  const handleLogout = () => {
    localStorage.clear();
    setToken("");
    setUser(null);
    setView("login");
  };

  // admin actions (delete / cancel)
  const deleteUser = async (id, type = "user") => {
    if (!confirm(`Delete this ${type}?`)) return;
    try {
    await apiClient(token).delete(`/admin/user/${id}`);
    if (type === "user") setUsers((s) => s.filter((u) => u._id !== id));
    else setHosts((s) => s.filter((h) => h._id !== id));
    } catch (err) {
    alert("Failed to delete");
    }
};

  const deleteCar = async (id) => {
    if (!confirm("Delete this car?")) return;
    try {
      await apiClient(token).delete(`/admin/car/${id}`);
      setCars((s) => s.filter((c) => c._id !== id));
    } catch (err) {
      alert("Failed to delete car");
    }
  };

  const cancelBooking = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await apiClient(token).post(`/admin/booking/cancel/${id}`, {});
      setBookings((s) => s.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)));
    } catch (err) {
      alert("Failed to cancel");
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await apiClient(token).delete(`/admin/message/${id}`);
      setMessages((s) => s.filter((m) => m._id !== id));
    } catch (err) {
      alert("Failed to delete message");
    }
  };

  // quick helpers for local filtering
  const filtered = (arr) => {
    if (!searchQuery) return arr;
    const q = searchQuery.toLowerCase();
    return arr.filter((x) => JSON.stringify(x).toLowerCase().includes(q));
  };

  /* ---------- LOGIN PAGE ---------- */
  function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
      setEmail(localStorage.getItem("admin_demo_email") || "");
    }, []);

    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100">
        <div className="w-full max-w-md">
          <GlassCard>
            <h2 className="text-2xl font-semibold mb-2">Admin sign in</h2>
            <p className="text-sm text-slate-600 mb-4">Use your admin credentials to access the panel.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin(email, password);
              }}
              className="space-y-3"
            >
              <input
                className="w-full rounded-md border border-white/40 px-3 py-2 bg-white/80"
                placeholder="admin email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="w-full rounded-md border border-white/40 px-3 py-2 bg-white/80"
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {loginError && <div className="text-sm text-red-600">{loginError}</div>}

              <div className="flex gap-2 mt-2">
                <button type="submit" className="btn btn-primary" disabled={loginLoading}>
                  {loginLoading ? "Signing in..." : "Sign in"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setEmail("admin@gmail.com");
                    setPassword("Admin123");
                    localStorage.setItem("admin_demo_email", "admin@gmail.com");
                  }}
                >
                  Fill demo
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    );
  }

  /* ---------- LAYOUT ---------- */
  function Topbar() {
    return (
      <div className="topnav flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-indigo font-bold">RC</div>
          <div>
            <div className="text-indigo text-lg font-semibold">RenCar Admin</div>
            <div className="text-xs text-indigo/90">Glass Dashboard</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn btn-ghost text-black/90" onClick={() => { setView("/"); setSearchQuery(""); }}>
            Home
          </button>
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  function Sidebar() {
    const items = [
      { key: "/", label: "Overview" },
      { key: "users", label: "Users" },
      { key: "hosts", label: "Hosts" },
      { key: "cars", label: "Cars" },
      { key: "bookings", label: "Bookings" },
      { key: "messages", label: "Messages" },
    ];
    return (
      <div className="sidebar w-64 p-4">
        <div className="mb-6">
          <div className="text-sm text-slate-500 mb-1">Signed in as</div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center font-semibold text-white">
              {user?.username?.[0]?.toUpperCase() || "A"}
            </div>
            <div>
              <div className="font-semibold">{user?.username || user?.email}</div>
              <div className="text-xs text-slate-500">{user?.role}</div>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => setView(it.key)}
              className={`link sidebar-link text-left w-full ${view === it.key ? "bg-indigo-50 text-indigo-600" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-200/80" />
                <span>{it.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="mt-6">
          <button
            className="btn btn-ghost w-full"
            onClick={() => {
              setToken("");
              setUser(null);
              localStorage.clear();
              setView("login");
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  /* ---------- PAGES ---------- */

  function OverviewPage() {
    return (
      <div className="flex-1 px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <GlassCard>
            <div className="text-sm text-slate-600">Users</div>
            <div className="text-2xl font-semibold mt-2">{stats?.totalUsers ?? "—"}</div>
          </GlassCard>
          <GlassCard>
            <div className="text-sm text-slate-600">Hosts</div>
            <div className="text-2xl font-semibold mt-2">{stats?.totalHosts ?? "—"}</div>
          </GlassCard>
          <GlassCard>
            <div className="text-sm text-slate-600">Cars</div>
            <div className="text-2xl font-semibold mt-2">{stats?.totalCars ?? "—"}</div>
          </GlassCard>
          <GlassCard>
            <div className="text-sm text-slate-600">Bookings</div>
            <div className="text-2xl font-semibold mt-2">{stats?.totalBookings ?? "—"}</div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <GlassCard className="col-span-2">
            <h3 className="font-semibold mb-2">Recent Activity</h3>
            <div className="space-y-3">
              {(bookings || []).slice(0, 4).map((b) => (
                <div key={b._id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{b.car_id?.brand} {b.car_id?.model}</div>
                    <div className="text-xs text-slate-500">{b.user_id?.username || b.user_id?.email}</div>
                  </div>
                  <div className="text-sm text-slate-500">{new Date(b.created_at).toLocaleDateString()}</div>
                </div>
              ))}
              {!bookings.length && <div className="text-sm text-slate-500">No recent bookings</div>}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-2">Messages</h3>
            <div className="space-y-2">
              {(messages || []).slice(0, 4).map((m) => (
                <div key={m._id}>
                  <div className="text-sm font-medium">{m.name}</div>
                  <div className="text-xs text-slate-500">{m.subject}</div>
                </div>
              ))}
              {!messages.length && <div className="text-sm text-slate-500">No messages</div>}
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  function UsersPage() {
    return (
      <div className="flex-1 px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Users</h2>
          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              onClick={async () => {
                await fetchUsers();
                alert("Refreshed");
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered(users).map((u) => (
                <tr key={u._id}>
                  <td>{u.username || u.full_name}</td>
                  <td>{u.email}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteUser(u._id, "user")}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan="4" className="text-slate-500 p-4">No users</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function HostsPage() {
    return (
      <div className="flex-1 px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Hosts</h2>
          <button className="btn btn-primary" onClick={fetchHosts}>Refresh</button>
        </div>

        <div className="space-y-3">
          {filtered(hosts).map((h) => (
            <div key={h._id} className="card flex items-center justify-between">
              <div>
                <div className="font-semibold">{h.username}</div>
                <div className="text-sm text-slate-500">{h.email}</div>
              </div>
              <div>
                <button className="delete-btn" onClick={() => deleteUser(h._id, "host")}>Delete</button>
              </div>
            </div>
          ))}
          {hosts.length === 0 && <div className="text-slate-500">No hosts</div>}
        </div>
      </div>
    );
  }

  function CarsPage() {
    return (
      <div className="flex-1 px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Cars</h2>
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={fetchCars}>Refresh</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered(cars).map((c) => (
            <div key={c._id} className="card flex items-center gap-4">
              {c.image_path && (
                <img src={c.image_path.startsWith("http") ? c.image_path : `http://localhost:5000/${c.image_path}`} alt={`${c.brand} ${c.model}`} className="w-36 h-24 object-cover rounded" />
              )}
              <div className="flex-1">
                <div className="font-semibold">{c.brand} {c.model}</div>
                <div className="text-sm text-slate-500">₹{c.price_per_day} • {c.location}</div>
                <div className="text-xs mt-1">{c.description}</div>
              </div>
              <div>
                <button className="delete-btn" onClick={() => deleteCar(c._id)}>Delete</button>
              </div>
            </div>
          ))}
          {cars.length === 0 && <div className="text-slate-500">No cars</div>}
        </div>
      </div>
    );
  }

  function BookingsPage() {
    return (
      <div className="flex-1 px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Bookings</h2>
          <button className="btn btn-primary" onClick={fetchBookings}>Refresh</button>
        </div>

        <div className="table-wrap">
          <table className="table w-full">
            <thead>
              <tr><th>Car</th><th>User</th><th>Dates</th><th>Price</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered(bookings).map((b) => (
                <tr key={b._id}>
                  <td>{b.car_id?.brand} {b.car_id?.model}</td>
                  <td>{b.user_id?.username || b.user_id?.email}</td>
                  <td>{new Date(b.start_date).toLocaleDateString()} → {new Date(b.end_date).toLocaleDateString()}</td>
                  <td>₹{b.total_price}</td>
                  <td>{b.status}</td>
                  <td>{b.status !== "cancelled" && <button className="delete-btn" onClick={() => cancelBooking(b._id)}>Cancel</button>}</td>
                </tr>
              ))}
              {bookings.length === 0 && <tr><td colSpan="6" className="text-slate-500 p-4">No bookings</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function MessagesPage() {
    return (
      <div className="flex-1 px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <button className="btn btn-primary" onClick={fetchMessages}>Refresh</button>
        </div>

        <div className="space-y-3">
          {filtered(messages).map((m) => (
            <div key={m._id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-sm text-slate-500">{m.email}</div>
                </div>
                <div className="text-sm text-slate-500">{new Date(m.submitted_at).toLocaleString()}</div>
              </div>
              <div className="mt-2">
                <div className="font-medium">{m.subject}</div>
                <p className="mt-1 text-slate-700">{m.message}</p>
              </div>
              <div className="mt-3 text-right">
                <button className="delete-btn" onClick={() => deleteMessage(m._id)}>Delete</button>
              </div>
            </div>
          ))}
          {messages.length === 0 && <div className="text-slate-500">No messages</div>}
        </div>
      </div>
    );
  }

  /* ---------- Main render ---------- */

  if (!token || !user || view === "login") {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen">
      <div className="fixed inset-x-0 top-0 z-40">
        <Topbar />
      </div>

      <div className="pt-20 flex">
        <aside className="sticky top-20">
          <Sidebar />
        </aside>

        <main className="flex-1 ml-0">
          {loading && (
            <div className="p-6">
              <GlassCard><div className="text-slate-600">Loading...</div></GlassCard>
            </div>
          )}

          {!loading && view === "/" && <OverviewPage />}
          {!loading && view === "users" && <UsersPage />}
          {!loading && view === "hosts" && <HostsPage />}
          {!loading && view === "cars" && <CarsPage />}
          {!loading && view === "bookings" && <BookingsPage />}
          {!loading && view === "messages" && <MessagesPage />}
        </main>
      </div>
    </div>
  );
}
