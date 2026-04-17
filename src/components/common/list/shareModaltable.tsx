import React from "react"
interface EmailEntry {
    email: string
    share: boolean
    modifyInput: boolean
    output: boolean
    initiateSample: boolean
}

interface EmailPermissionsTableProps {
    addedEmails: EmailEntry[]
    toggleCheckbox: (index: number, field: keyof Omit<EmailEntry, "email">) => void
}

const EmailPermissionsTable: React.FC<EmailPermissionsTableProps> = ({ addedEmails, toggleCheckbox }) => {
    if (addedEmails.length === 0) {
        return <div className="text-center py-8 text-gray-500">No user added</div>
    }

    return (
        <div className="border border-gray-200 rounded-md overflow-hidden mb-4">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Share</th>
                        </tr>
                </thead>
                <tbody>
                    {addedEmails.map((entry, index) => (
                        <tr key={index} className="border-t border-gray-200">
                            <td className="px-4 py-3 text-sm text-gray-900">{entry.email}</td>
                            {["share"].map((field) => (
                                <td key={field} className="px-4 py-3 text-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-blue-500"
                                        checked={entry[field as keyof EmailEntry] as boolean || field === "share"}
                                        onChange={() => toggleCheckbox(index, field as keyof Omit<EmailEntry, "email">)}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default EmailPermissionsTable
