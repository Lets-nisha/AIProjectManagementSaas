import { Settings } from 'lucide-react'
import React from 'react'

const SettingsPage = () => {
    return (
        <>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 w-full">
                <Settings size={18} className="text-slate-400" />
                Settings
            </button>
        </>
    )
}

export default SettingsPage