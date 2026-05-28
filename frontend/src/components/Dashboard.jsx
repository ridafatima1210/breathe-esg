import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null); // Lineage inspector state
  const API_BASE = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/emissions/`);
      if (!res.ok) throw new Error('API server communication error.');
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/emissions/${id}/action/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setRecords(records.map(r => r.id === id ? { ...r, status } : r));
        if (selectedRecord && selectedRecord.id === id) {
          setSelectedRecord({ ...selectedRecord, status });
        }
      }
    } catch (err) {
      alert('Error updating row lifecycle state.');
    }
  };

  const injectMockData = async () => {
    const mockPayload = {
      organization_id: 1,
      source_type: 'SAP',
      payload: [
        { MENGE: "4500", MEINS: "LITER", MATNR: "DIESEL_FUEL_04", WERKS: "DE_PLANT_10", Start_Date: "2026-05-01", End_Date: "2026-05-15" },
        { MENGE: "95000", MEINS: "LITER", MATNR: "HEAVY_OIL_09", WERKS: "DE_PLANT_12", Start_Date: "2026-05-01", End_Date: "2026-05-15" }
      ]
    };
    const mockUtilityPayload = {
      organization_id: 1,
      source_type: 'UTILITY',
      payload: [
        { Usage_kWh: "14250", Meter_ID: "MTR-882910", Bill_Period_Start: "2026-04-12", Bill_Period_End: "2026-05-11" }
      ]
    };
    const mockConcurPayload = {
      organization_id: 1,
      source_type: 'CONCUR',
      payload: [
        { OriginAirport: "JFK", DestAirport: "LAX", Passenger: "Rashi Abhishek", CabinClass: "Business" },
        { OriginAirport: "LHR", DestAirport: "LHR", Passenger: "Test Account", CabinClass: "Economy" }
      ]
    };

    try {
      await fetch(`${API_BASE}/ingest/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mockPayload) });
      await fetch(`${API_BASE}/ingest/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mockUtilityPayload) });
      await fetch(`${API_BASE}/ingest/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(mockConcurPayload) });
      fetchRecords();
    } catch (e) {
      console.error(e);
    }
  };

  // Aggregated analytics metrics calculations
  const totalCO2 = records.reduce((acc, r) => r.status === 'APPROVED' ? acc + r.calculated_co2e_kg : acc, 0);
  const pendingCount = records.filter(r => r.status === 'PENDING').length;
  const anomalyCount = records.filter(r => r.is_suspicious && r.status === 'PENDING').length;

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto min-h-screen bg-slate-900 text-slate-100 font-sans">
      
      {/* Header Viewport */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg font-bold text-xl tracking-tight border border-emerald-500/20">B</span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Breathe<span className="text-emerald-400">ESG</span> Assurance Workspace
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">Multi-Tenant Corporate Ingestion & Audit Lockbox Pipeline</p>
        </div>
        <button 
          onClick={injectMockData}
          className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition duration-200 shadow-lg shadow-emerald-950/40 border border-emerald-500/30"
        >
          ⚡ Seed Client Data Streams
        </button>
      </header>

      {/* Real-time Metric Cards Panel */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-950/60 backdrop-blur border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-md">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Certified Carbon Footprint</p>
          <p className="text-3xl font-black mt-2 text-white font-mono">{Math.round(totalCO2).toLocaleString()} <span className="text-sm font-normal text-slate-500">kg CO₂e</span></p>
          <p className="text-xs text-slate-500 mt-2">Aggregated from signed-off, locked ledger entries</p>
        </div>
        <div className="bg-slate-950/60 backdrop-blur border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-md">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Awaiting Verification</p>
          <p className="text-3xl font-black mt-2 text-white font-mono">{pendingCount} <span className="text-sm font-normal text-slate-500">Rows</span></p>
          <p className="text-xs text-slate-500 mt-2">Requires analyst sign-off before official audit</p>
        </div>
        <div className="bg-slate-950/60 backdrop-blur border border-slate-800 p-6 rounded-2xl relative overflow-hidden shadow-md">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Active Pipeline Anomalies</p>
          <p className="text-3xl font-black mt-2 text-amber-400 font-mono">{anomalyCount} <span className="text-sm font-normal text-slate-500">Flagged</span></p>
          <p className="text-xs text-slate-500 mt-2">Data deviations triggered by validation logic</p>
        </div>
      </section>

      {/* Main Table Interface Grid & Side Inspector Drawer */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
<div className={`${selectedRecord ? 'xl:col-span-3' : 'xl:col-span-4 w-full'} transition-all duration-300 overflow-hidden bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl`}>          {loading ? (
            <div className="text-center py-20 text-slate-400 font-medium">Processing records and computing factors...</div>
          ) : error ? (
            <div className="m-6 bg-rose-900/20 border border-rose-800/60 p-4 rounded-xl text-rose-400 text-sm">{error}</div>
          ) : records.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p className="text-lg font-medium">No files or endpoints ingested yet</p>
              <p className="text-xs mt-1">Click the button above to safely drop mock streams into the sandbox environment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-medium tracking-wide text-xs uppercase">
                    <th className="p-4">Origin Channel</th>
                    <th className="p-4">Classification</th>
                    <th className="p-4">Activity Scope</th>
                    <th className="p-4 text-right">Raw Quantities</th>
                    <th className="p-4 text-right">Calculated CO₂e</th>
                    <th className="p-4 text-center">Quality Flag</th>
                    <th className="p-4 text-center">Workflow</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {records.map((row) => (
                    <tr 
                      key={row.id} 
                      onClick={() => setSelectedRecord(row)}
                      className={`cursor-pointer transition duration-150 ${selectedRecord?.id === row.id ? 'bg-slate-800/60' : 'hover:bg-slate-900/40'} ${row.is_suspicious && row.status === 'PENDING' ? 'bg-amber-950/10' : ''}`}
                    >
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                          row.source_type === 'SAP' ? 'bg-blue-950 text-blue-400 border-blue-800/40' :
                          row.source_type === 'UTILITY' ? 'bg-yellow-950 text-yellow-400 border-yellow-800/40' : 'bg-purple-950 text-purple-400 border-purple-800/40'
                        }`}>
                          {row.source_type}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 font-mono text-xs">{row.scope_category}</td>
                      <td className="p-4 font-medium text-slate-200 max-w-[200px] truncate" title={row.activity_type}>
                        {row.activity_type}
                      </td>
                      <td className="p-4 text-right font-mono text-slate-400 text-xs">
                        {row.raw_quantity.toLocaleString()} <span className="text-slate-600 text-[11px]">{row.raw_unit}</span>
                      </td>
                      <td className="p-4 text-right font-bold font-mono text-emerald-400">
                        {Math.round(row.calculated_co2e_kg).toLocaleString()} <span className="text-[10px] text-emerald-600 font-normal">kg</span>
                      </td>
                      <td className="p-4 text-center">
                        {row.is_suspicious ? (
                          <span className="inline-flex items-center bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full" title={row.anomaly_reason}>
                            ⚠️ Anomaly
                          </span>
                        ) : (
                          <span className="text-xs text-slate-700">—</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded border ${
                          row.status === 'APPROVED' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/50' :
                          row.status === 'REJECTED' ? 'bg-rose-950/80 text-rose-400 border-rose-800/50' :
                          'bg-slate-800 text-slate-400 border-slate-700/50'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        {row.status === 'PENDING' ? (
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => handleAction(row.id, 'APPROVED')}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition"
                            >
                              ✓
                            </button>
                            <button 
                              onClick={() => handleAction(row.id, 'REJECTED')}
                              className="bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-600 italic">Locked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Audit Lineage JSON Inspector Side Panel */}
        {selectedRecord && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative animate-fade-in">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Lineage Forensic View</h3>
                <p className="text-xs text-slate-500 mt-1">Record Index ID: #{selectedRecord.id}</p>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="text-slate-500 hover:text-slate-300 text-sm font-bold bg-slate-900 hover:bg-slate-800 p-1 rounded-md px-2"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-500 block">Activity Context</span>
                <p className="text-slate-200 font-medium text-sm mt-0.5">{selectedRecord.activity_type}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                <div>
                  <span className="text-slate-500 block">Start Window</span>
                  <p className="text-slate-300 font-mono">{selectedRecord.start_date}</p>
                </div>
                <div>
                  <span className="text-slate-500 block">End Window</span>
                  <p className="text-slate-300 font-mono">{selectedRecord.end_date}</p>
                </div>
              </div>

              {selectedRecord.is_suspicious && (
                <div className="p-3 bg-rose-950/30 border border-rose-900/60 rounded-xl text-rose-300">
                  <span className="font-bold block text-[10px] uppercase tracking-wider mb-0.5">Anomaly Flag Trigger Constraint</span>
                  {selectedRecord.anomaly_reason}
                </div>
              )}

              <div className="pt-4 border-t border-slate-900">
                <span className="text-slate-500 block mb-2">Immutable Source Payload Snapshot</span>
                <pre className="p-3 bg-slate-900 text-slate-300 rounded-xl overflow-x-auto font-mono text-[11px] leading-relaxed max-h-[250px]">
                  {JSON.stringify(selectedRecord.raw_payload_snapshot, null, 2)}
                </pre>
              </div>

              {selectedRecord.status === 'PENDING' && (
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button
                    onClick={() => handleAction(selectedRecord.id, 'APPROVED')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-center transition"
                  >
                    Approve Row
                  </button>
                  <button
                    onClick={() => handleAction(selectedRecord.id, 'REJECTED')}
                    className="bg-rose-950/50 hover:bg-rose-900 border border-rose-800/40 text-rose-300 font-bold py-2 rounded-xl text-center transition"
                  >
                    Flag Anomaly
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}