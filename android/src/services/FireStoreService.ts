import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    query,
    orderBy,
    limit,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// Kiểu Contact
export type Contact = {
    id: string;
    name: string;
    phone: string;
    createdAt?: Date;
};

// Kiểu CallHistory
export type CallHistory = {
    id: string;
    phone: string;
    type: "incoming" | "outgoing" | "missed";
    calledAt: Date;
};

// Thêm contact mới
export const addContact = async (name: string, phone: string): Promise<void> => {
    try {
        await addDoc(collection(db, "contacts"), {
            name,
            phone,
            createdAt: new Date(),
        });
    } catch (error) {
        console.error("Error adding contact:", error);
    }
};

// Lấy toàn bộ danh bạ
export const getContacts = async (): Promise<Contact[]> => {
    const snapshot = await getDocs(collection(db, "contacts"));
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name || "Không tên",
            phone: data.phone || "",
            createdAt: data.createdAt?.toDate?.() || new Date(),
        };
    });
};

// Xóa contact theo ID
export const deleteContact = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, "contacts", id));
};

// Cập nhật contact theo ID
export const updateContact = async (
    id: string,
    name: string,
    phone: string
): Promise<void> => {
    await updateDoc(doc(db, "contacts", id), { name, phone });
};

// Lưu lịch sử cuộc gọi
export const saveCallHistory = async (
    phone: string,
    type: "incoming" | "outgoing" | "missed"
): Promise<void> => {
    try {
        await addDoc(collection(db, "callHistory"), {
            phone,
            type,
            calledAt: new Date(),
        });
    } catch (error) {
        console.error("Error saving call history:", error);
    }
};

// Lấy lịch sử cuộc gọi (mới nhất đến cũ nhất)
export const getCallHistory = async (): Promise<CallHistory[]> => {
    const callHistoryQuery = query(
        collection(db, "callHistory"),
        orderBy("calledAt", "desc") // Sắp xếp theo thời gian giảm dần
        // limit(50) // Nếu muốn giới hạn 50 dòng đầu tiên
    );

    const snapshot = await getDocs(callHistoryQuery);
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            phone: data.phone || "",
            type: data.type || "incoming",
            calledAt: data.calledAt?.toDate?.() || new Date(),
        };
    });
};
// Xoá 1 cuộc gọi theo ID
export const deleteCallHistory = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, "callHistory", id));
        console.log(`Deleted call history with id ${id}`);
    } catch (error) {
        console.error("Error deleting call history:", error);
    }
};
