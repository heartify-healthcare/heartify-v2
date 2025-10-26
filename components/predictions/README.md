# Predictions Screen - Heartify v2

## 📋 Tổng quan

Trang **Predictions** là một phần quan trọng của ứng dụng Heartify, cho phép người dùng xem các phiên đo ECG (electrocardiogram), kết quả phân tích AI, và các khuyến nghị sức khỏe tim mạch.

## 🏗️ Cấu trúc thư mục

```
app/(tabs)/
  └── index.tsx                    # Trang Predictions chính
  
components/predictions/
  ├── ECGChart.tsx                 # Component hiển thị biểu đồ ECG
  ├── ECGSessionCard.tsx           # Component card cho mỗi session
  ├── types.ts                     # TypeScript type definitions
  ├── mockData.ts                  # Mock data cho development
  └── index.ts                     # Barrel export file
  
styles/(tabs)/
  └── index.tsx                    # Styles cho Predictions screen
```

## ✨ Tính năng

### 1. Danh sách ECG Sessions
- Hiển thị tất cả phiên đo ECG của người dùng
- Sắp xếp theo thời gian (mới nhất trước)
- ID tăng dần (Session #1, #2, #3,...)
- Hiển thị thời gian đo (format: YYYY-MM-DD HH:mm)

### 2. Chi tiết ECG Recording
Khi expand một session, hiển thị:
- **Raw Signal Chart**: Tín hiệu ECG gốc (màu xanh dương)
- **Denoised Signal Chart**: Tín hiệu đã lọc nhiễu (màu xanh lá)
- **Sampling Rate**: Tần số lấy mẫu (Hz)
- **Lead Type**: Loại điện cực

### 3. Kết quả dự đoán
- **Diagnosis**: Chẩn đoán (Normal Sinus Rhythm, Atrial Fibrillation, etc.)
- **Probability**: Độ tin cậy của dự đoán (%)
- **Features**: Các đặc trưng đo được:
  - PR Interval
  - Heart Rate
  - QRS Duration

### 4. AI Explanation
- **Analysis Input**: Thông tin đầu vào cho AI
- **Summary**: Tóm tắt kết quả
- **Details**: Chi tiết phân tích
- **Recommendation**: Khuyến nghị sức khỏe

## 🎨 Thiết kế UI

### Màu sắc
- **Primary Color**: `#e74c3c` (Heartify Red)
- **Background**: `#f5f5f5` (Light Gray)
- **Card Background**: `#ffffff` (White)
- **Text Primary**: `#2c3e50` (Dark Blue)
- **Text Secondary**: `#7f8c8d` (Gray)
- **Success**: `#27ae60` (Green)
- **Info**: `#3498db` (Blue)

### Typography
- **Title**: 6% screen width, bold
- **Description**: 4% screen width, regular
- **Section Title**: 4.5% screen width, bold
- **Body Text**: 3.5% screen width, regular

### Spacing
- **Container Padding**: 5% screen width
- **Card Margin**: 2% screen height
- **Section Spacing**: 2.5% screen height

## 🔧 Cài đặt

### Dependencies cần thiết

```bash
# React Native SVG để hiển thị biểu đồ
npx expo install react-native-svg
```

### Import trong project

```typescript
import { ECGSessionCard, ECGChart } from '@/components/predictions';
import type { ECGSession, Prediction, ECGRecording } from '@/components/predictions';
```

## 📱 Sử dụng

### Basic Usage

```typescript
import { mockECGSessions, mockDetailedData } from '@/components/predictions/mockData';

const PredictionsScreen = () => {
  const [sessions, setSessions] = useState(mockECGSessions);
  
  const handleExpand = (sessionId: string) => {
    // Load detailed data when user expands a session
    // In production: call API here
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {sessions.map((session, index) => (
          <ECGSessionCard
            key={session.id}
            session={session}
            index={index}
            styles={styles}
            onExpand={handleExpand}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
```

## 🔌 Tích hợp API

### Endpoint cần implement

1. **GET /ecg-sessions**
   - Query params: `page`, `size`, `sortBy`, `sortDir`
   - Response: Danh sách ECG sessions

2. **GET /ecg-recordings/{ecg_id}**
   - Response: Chi tiết recording (raw data, denoised data)

3. **GET /predictions/{prediction_id}**
   - Response: Kết quả dự đoán

4. **GET /explanations/{explanation_id}**
   - Response: Giải thích từ AI

### Luồng hoạt động

```
1. User mở trang Predictions
   └─> Call: GET /ecg-sessions?page=0&size=10&sortBy=createdAt&sortDir=desc
   
2. User click expand một session
   ├─> Call: GET /ecg-recordings/{ecg_id}
   ├─> Call: GET /predictions/{prediction_id}
   └─> Call: GET /explanations/{explanation_id}
```

## 📊 Mock Data

Mock data được cung cấp trong `components/predictions/mockData.ts`:
- 3 ECG sessions mẫu
- Chi tiết đầy đủ cho từng session
- Dữ liệu dựa trên `z-api-test.md`

## 🧪 Testing

### Test cases cần cover
- [ ] Hiển thị danh sách sessions
- [ ] Expand/collapse card
- [ ] Hiển thị biểu đồ ECG
- [ ] Hiển thị thông tin prediction
- [ ] Hiển thị explanation
- [ ] Format date/time
- [ ] Format feature names
- [ ] Empty state (không có sessions)

## 🚀 Next Steps

1. **API Integration**: Thay thế mock data bằng API calls thực
2. **Loading States**: Thêm skeleton/spinner khi load data
3. **Error Handling**: Xử lý lỗi khi API fail
4. **Pull to Refresh**: Cho phép user refresh danh sách
5. **Pagination**: Load more sessions khi scroll
6. **Search/Filter**: Tìm kiếm và lọc sessions
7. **Export**: Xuất kết quả ra PDF/Email

## 📝 Ghi chú

- Code đã được chuẩn bị sẵn để tích hợp API
- Tất cả components đều responsive
- Follow coding style của Health và Settings screens
- TypeScript types đầy đủ cho type safety

## 👤 Author

Senior Frontend Developer - Heartify Healthcare Team

---

**Last Updated**: October 27, 2025
