import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/firestore';
import { storage } from './firebase';
import { db } from "../firebase/firebaseConfig";

// Kiểu Contact
export type Contact = {
    id: string;
    name: string;
    phone: string;
    email?: string;
    company?: string;
    createdAt?: Date;
};

// Kiểu CallHistory
export type CallHistory = {
    id: string;
    phone: string;
    name? : string;
    type: "incoming" | "outgoing" | "missed";
    calledAt: Date;
};

// Thêm contact mới
export const addContact = async (name: string, phone: string, email? : string, company? : string): Promise<void> => {
    try {
        await addDoc(collection(db, "contacts"), {
            name,
            phone,
            email,
            company,
            createdAt: new Date(),
        });
    } catch (error) {
        console.error("Error adding contact:", error);
    }
};

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const imageRef = ref(storage, `images/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    throw new Error(`Upload failed: ${(error as Error).message}`);
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

import { where as firebaseWhere, WhereFilterOp } from "firebase/firestore";

export const getContactByPhoneNumber = async (
  phone: string,
): Promise<Contact | null> => {
  const q = query(collection(db, 'contacts'), where('phone', '==', phone));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();

    return {
      id: docSnap.id,
      name: data.name || 'Không tên',
      phone: data.phone || '',
      createdAt: data.createdAt?.toDate?.() || new Date(),
    };
  } else {
    console.log('Không tìm thấy contact với số điện thoại:', phone);
    return null;
  }
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
    name : string,
    type: "incoming" | "outgoing" | "missed"
): Promise<void> => {
    try {
        await addDoc(collection(db, "callHistory"), {
            phone,
            name,
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
            name : data.name || "",
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
function where(fieldPath: string, opStr: WhereFilterOp, value: any) {
    return firebaseWhere(fieldPath, opStr, value);
}

