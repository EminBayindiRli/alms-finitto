import pandas as pd
import requests
from fpdf import FPDF
from sklearn.ensemble import IsolationForest
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import numpy as np
from supabase import create_client, Client
import os
from datetime import datetime

# Supabase yapılandırması
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("WARNING: SUPABASE_URL and SUPABASE_KEY environment variables must be set")
    # Dummy test verileri kullanacağız
    supabase = None
else:
    try:
        # Supabase istemcisini oluştur
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Supabase client created successfully")
    except Exception as e:
        print(f"ERROR creating Supabase client: {e}")
        supabase = None

# Performans metriklerini hesaplama
def calculate_performance_metrics(employee_data):
    """Çalışan verilerinden performans metriklerini hesaplar"""
    try:
        # Varsayılan değerler
        default_metrics = {
            "task_completion_rate": 0,
            "email_efficiency": 0,
            "meeting_efficiency": 0,
            "communication_score": 0,
            "collaboration_score": 0,
            "time_efficiency": 0,
            "file_activity": 0
        }
        
        if not employee_data:
            return default_metrics

        # Temel metrikler
        tasks_assigned = employee_data.get("tasks_assigned", 0)
        tasks_completed = employee_data.get("tasks_completed", 0)
        task_completion_rate = tasks_completed / max(tasks_assigned, 1)
        
        email_response_time = employee_data.get("email_response_time", 0)
        email_efficiency = 1 / (1 + email_response_time / 60)  # Normalize edilmiş yanıt süresi
        
        meeting_duration = employee_data.get("meeting_duration", 0)
        meeting_efficiency = 1 - (meeting_duration / (8 * 60))  # 8 saatlik güne oranı
        
        # İletişim ve işbirliği metrikleri
        email_sent = employee_data.get("email_sent_count", 0)
        chat_messages = employee_data.get("chat_messages", 0)
        communication_score = (email_sent + chat_messages) / 100
        
        shared_files = employee_data.get("shared_files", 0)
        comments = employee_data.get("comments_made", 0)
        collaboration_score = (shared_files + comments) / 20
        
        # Zaman yönetimi
        focus_hours = employee_data.get("focus_hours", 0)
        productivity_time = focus_hours + (meeting_duration / 60)
        time_efficiency = productivity_time / 8  # 8 saatlik güne oranı
        
        # Dosya aktivitesi
        files_edited = employee_data.get("files_edited", 0)
        files_accessed = employee_data.get("files_accessed", 1)
        file_activity = files_edited / max(files_accessed, 1)
        
        return {
            "task_completion_rate": round(task_completion_rate, 2),
            "email_efficiency": round(email_efficiency, 2),
            "meeting_efficiency": round(meeting_efficiency, 2),
            "communication_score": round(communication_score, 2),
            "collaboration_score": round(collaboration_score, 2),
            "time_efficiency": round(time_efficiency, 2),
            "file_activity": round(file_activity, 2)
        }
    except Exception as e:
        print(f"Error calculating metrics: {str(e)}")
        return default_metrics

# Trend analizi yapma
def analyze_trends(employee_data_list):
    """Çalışan verilerindeki trendleri analiz eder"""
    
    trends = {
        "task_completion": [],
        "communication": [],
        "collaboration": [],
        "time_management": []
    }
    
    for data in employee_data_list:
        # Görev trendleri
        task_trend = {
            "day": data["day"],
            "completion_rate": data["tasks_completed"] / data["tasks_assigned"],
            "overdue_ratio": data["overdue_ratio"]
        }
        trends["task_completion"].append(task_trend)
        
        # İletişim trendleri
        comm_trend = {
            "day": data["day"],
            "email_activity": data["email_sent_count"],
            "chat_activity": data["chat_messages"],
            "response_time": data["email_response_time"]
        }
        trends["communication"].append(comm_trend)
        
        # İşbirliği trendleri
        collab_trend = {
            "day": data["day"],
            "file_sharing": data["shared_files"],
            "comments": data["comments_made"],
            "meeting_participation": data["camera_on_ratio"]
        }
        trends["collaboration"].append(collab_trend)
        
        # Zaman yönetimi trendleri
        time_trend = {
            "day": data["day"],
            "focus_time": data["focus_hours"],
            "meeting_time": data["meeting_duration"] / 60
        }
        trends["time_management"].append(time_trend)
    
    return trends

# Eğitim önerileri oluşturma
def generate_recommendations(metrics, trends):
    """
    Generates personalized recommendations based on performance metrics and trends
    
    Args:
        metrics: Performance metrics dictionary
        trends: Performance trends dictionary
        
    Returns:
        list: List of recommendation dictionaries
    """
    recommendations = []
    
    # Task completion recommendations
    if metrics["task_completion_rate"] < 0.6:
        recommendations.append({
            'area': 'Task Management',
            'issue': 'Low task completion rate',
            'suggestion': 'Consider time management and task prioritization training',
            'expected_impact': 'Improved task completion rate and productivity'
        })
    
    # Email efficiency recommendations
    if metrics["email_efficiency"] < 0.6:
        recommendations.append({
            'area': 'Communication',
            'issue': 'Slow email response',
            'suggestion': 'Training on email management and response prioritization',
            'expected_impact': 'Better email response times and communication efficiency'
        })
    
    # Meeting efficiency recommendations
    if metrics["meeting_efficiency"] < 0.6:
        recommendations.append({
            'area': 'Meeting Management',
            'issue': 'Low meeting effectiveness',
            'suggestion': 'Workshop on effective meeting participation and time management',
            'expected_impact': 'More productive meetings and better time utilization'
        })
    
    # Collaboration recommendations
    if metrics["collaboration_score"] < 0.6:
        recommendations.append({
            'area': 'Team Collaboration',
            'issue': 'Weak collaboration',
            'suggestion': 'Team building activities and collaboration tools training',
            'expected_impact': 'Enhanced team cooperation and project outcomes'
        })
    
    # Trend-based recommendations
    for metric, trend in trends.items():
        if trend['direction'] == 'decreasing' and trend['change_rate'] < -0.1:
            recommendations.append({
                'area': metric.replace('_', ' ').title(),
                'issue': 'Negative trend',
                'suggestion': f'Performance improvement plan for {metric.replace("_", " ")}',
                'expected_impact': 'Reverse negative trend and improve performance'
            })
    
    return recommendations

# Microsoft Learn API'si ile eğitim içeriği çekme
def get_microsoft_training_content(topic):
    url = f"https://learn.microsoft.com/api/search?search={topic}&locale=en-us"
    try:
        response = requests.get(url)
        response.raise_for_status()  # HTTP hatalarını kontrol et
        data = response.json()
        courses = []
        for item in data.get("results", [])[:3]:
            title = item.get("title", "Unknown Title")
            course_url = item.get("url", "#")  # Eksik URL'ler için varsayılan değer
            if course_url.startswith("http"):  # Geçerli URL'leri kontrol et
                courses.append({"title": title, "url": course_url})
        return courses
    except requests.exceptions.RequestException as e:
        print(f"API Request Failed: {e}")
        return []

# Kişiselleştirilmiş eğitim planı oluşturma
def create_personalized_training_plan(employee_id, recommendations):
    training_plan = {"employee_id": employee_id, "training_recommendations": []}
    for recommendation in recommendations:
        topic = recommendation["suggestion"].lower().replace(" ", "+")
        courses = get_microsoft_training_content(topic)
        training_plan["training_recommendations"].append({
            "recommendation": recommendation["suggestion"],
            "courses": courses
        })
    return training_plan

# PDF rapor oluşturma
def generate_pdf_report(employee_id, performance_metrics, training_plan):
    pdf = FPDF()
    pdf.add_page()
    
    # Font ayarları - DejaVu Sans kullan (Unicode desteği için)
    pdf.add_font('DejaVu', '', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', uni=True)
    pdf.set_font('DejaVu', '', 12)
    
    # Başlık
    pdf.set_font('DejaVu', '', 16)
    pdf.cell(0, 10, f"Employee Performance Report - ID: {employee_id}", ln=True, align='C')
    
    # Performans Metrikleri
    pdf.set_font('DejaVu', '', 14)
    pdf.cell(0, 10, "Performance Metrics", ln=True)
    
    pdf.set_font('DejaVu', '', 12)
    pdf.cell(0, 10, f"Task Completion Rate: %{performance_metrics['task_completion_rate']*100:.1f}", ln=True)
    pdf.cell(0, 10, f"Email Efficiency: %{performance_metrics['email_efficiency']*100:.1f}", ln=True)
    pdf.cell(0, 10, f"Meeting Efficiency: %{performance_metrics['meeting_efficiency']*100:.1f}", ln=True)
    pdf.cell(0, 10, f"Collaboration Score: %{performance_metrics['collaboration_score']*100:.1f}", ln=True)
    
    # Eğitim Önerileri
    pdf.ln(10)
    pdf.set_font('DejaVu', '', 14)
    pdf.cell(0, 10, "Training Recommendations", ln=True)
    
    pdf.set_font('DejaVu', '', 12)
    for rec in training_plan["training_recommendations"]:
        pdf.cell(0, 10, f"• {rec['recommendation']}", ln=True)
        for course in rec["courses"]:
            pdf.cell(0, 10, f"- {course['title']}", ln=True)
            pdf.cell(0, 10, f"  ({course['url']})", ln=True)
    
    pdf.output(f"employee_{employee_id}_report.pdf")

# Supabase'den veri okuma ve analiz etme
def analyze_employee_data(employee_id):
    """Belirli bir çalışanın verilerini analiz eder"""
    try:
        # Supabase'den veri çekme
        response = supabase.table('employee_data').select('*').eq('employee_id', employee_id).execute()
        employee_data = response.data

        if not employee_data:
            return {"error": "Employee not found"}

        # Çalışan bilgilerini al
        emp_response = supabase.table('employees').select('*').eq('id', employee_id).execute()
        employee_info = emp_response.data[0]

        # Performans metriklerini hesapla
        performance_metrics = calculate_performance_metrics(employee_data[-1])

        # Trendleri analiz et
        trends = analyze_trends(employee_data)

        # Eğitim önerileri
        recommendations = generate_recommendations(performance_metrics, trends)

        # Kişiselleştirilmiş eğitim planı
        training_plan = create_personalized_training_plan(employee_id, recommendations)

        return {
            "employee_info": employee_info,
            "employee_data": employee_data,
            "performance_metrics": performance_metrics,
            "trends": trends,
            "recommendations": recommendations,
            "training_plan": training_plan
        }

    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        return {
            "error": f"Error during analysis: {str(e)}",
            "employee_data": employee_data if 'employee_data' in locals() else [],
            "performance_metrics": {}
        }

# Anomaly detection
def detect_anomalies(data):
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(data)
    model = IsolationForest(contamination=0.1)
    anomalies = model.fit_predict(scaled_data)
    return anomalies

# Clustering analysis
def perform_clustering(data):
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(data)
    kmeans = KMeans(n_clusters=3)
    clusters = kmeans.fit_predict(scaled_data)
    return clusters, silhouette_score(scaled_data, clusters)

# Sentiment analysis
def analyze_sentiment(text):
    nltk.download('vader_lexicon')
    sia = SentimentIntensityAnalyzer()
    return sia.polarity_scores(text)

# Time series forecasting
def forecast_performance(data):
    df = data[['date', 'metric']].rename(columns={'date': 'ds', 'metric': 'y'})
    model = Prophet()
    model.fit(df)
    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)
    return forecast

# Veriyi hazırla
def prepare_data_for_analysis(performance_metrics):
    # Sözlük verilerini numpy dizisine dönüştür
    metrics_array = np.array([[
        performance_metrics['task_completion_rate'],
        performance_metrics['email_efficiency'],
        performance_metrics['meeting_efficiency'],
        performance_metrics['communication_score'],
        performance_metrics['collaboration_score'],
        performance_metrics['time_efficiency'],
        performance_metrics['file_activity']
    ]])
    return metrics_array

# Kapsamlı Trend Analizi
def analyze_detailed_trends(data):
    df = pd.DataFrame(data)
    
    # Günlük trend analizi
    daily_trends = df.groupby('day').agg({
        'tasks_completed': ['mean', 'std'],
        'email_sent_count': ['mean', 'std'],
        'meeting_duration': ['mean', 'std'],
        'focus_hours': ['mean', 'std']
    }).reset_index()
    
    # Haftalık trend analizi (7 günlük hareketli ortalama)
    df['rolling_avg_tasks'] = df['tasks_completed'].rolling(window=7).mean()
    df['rolling_avg_emails'] = df['email_sent_count'].rolling(window=7).mean()
    
    # Mevsimsellik analizi (eğer varsa)
    seasonal_patterns = {}
    for metric in ['tasks_completed', 'email_sent_count', 'meeting_duration', 'focus_hours']:
        decomposition = pd.DataFrame()
        decomposition['trend'] = df[metric].rolling(window=7).mean()
        decomposition['seasonal'] = df[metric] - decomposition['trend']
        seasonal_patterns[metric] = decomposition.to_dict()
    
    return {
        'daily_trends': daily_trends.to_dict(),
        'rolling_averages': df[['day', 'rolling_avg_tasks', 'rolling_avg_emails']].to_dict(),
        'seasonal_patterns': seasonal_patterns
    }

# Gelişmiş Kümeleme ve Segmentasyon
def advanced_clustering(data):
    df = pd.DataFrame(data)
    features = ['tasks_completed', 'email_sent_count', 'meeting_duration', 'focus_hours', 'email_response_time']
    
    # Veri boyutu kontrolü
    if len(df) < 3:  # Minimum 3 veri noktası gerekli
        return {
            'error': 'Not enough data for clustering analysis',
            'min_required_samples': 3,
            'current_samples': len(df)
        }
    
    # Veriyi ölçeklendirme
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(df[features])
    
    # PCA ile boyut indirgeme
    pca = PCA(n_components=2)
    pca_result = pca.fit_transform(scaled_data)
    
    # Optimal küme sayısını bulma
    max_clusters = min(5, len(df) - 1)  # Veri sayısından bir eksiği olmalı
    if max_clusters < 2:
        max_clusters = 2
    
    silhouette_scores = []
    K = range(2, max_clusters + 1)
    for k in K:
        kmeans = KMeans(n_clusters=k, random_state=42)
        cluster_labels = kmeans.fit_predict(scaled_data)
        silhouette_avg = silhouette_score(scaled_data, cluster_labels)
        silhouette_scores.append(silhouette_avg)
    
    optimal_clusters = K[np.argmax(silhouette_scores)]
    
    # Final kümeleme
    kmeans = KMeans(n_clusters=optimal_clusters, random_state=42)
    df['cluster'] = kmeans.fit_predict(scaled_data)
    
    # Küme özellikleri
    cluster_profiles = df.groupby('cluster')[features].mean()
    
    return {
        'pca_result': pca_result.tolist(),
        'optimal_clusters': optimal_clusters,
        'cluster_profiles': cluster_profiles.to_dict(),
        'explained_variance': pca.explained_variance_ratio_.tolist()
    }

# Gelişim Takibi
def track_development(employee_id, historical_data):
    df = pd.DataFrame(historical_data)
    
    # Temel metrikler üzerinden gelişim analizi
    metrics_over_time = df.groupby('day').agg({
        'tasks_completed': 'sum',
        'email_sent_count': 'sum',
        'meeting_duration': 'sum',
        'focus_hours': 'sum',
        'email_response_time': 'mean'
    }).reset_index()
    
    # Performans değişim oranı
    for metric in ['tasks_completed', 'email_sent_count', 'meeting_duration', 'focus_hours']:
        metrics_over_time[f'{metric}_change'] = metrics_over_time[metric].pct_change()
    
    # Verimlilik skoru hesaplama
    metrics_over_time['efficiency_score'] = (
        (metrics_over_time['tasks_completed'] * 0.4) +
        (metrics_over_time['email_sent_count'] * 0.3) +
        (metrics_over_time['meeting_duration'] * 0.3)
    ) / (metrics_over_time['email_response_time'] + 1)
    
    return {
        'metrics_over_time': metrics_over_time.to_dict(),
        'overall_improvement': {
            metric: (metrics_over_time[metric].iloc[-1] - metrics_over_time[metric].iloc[0]) / 
                   metrics_over_time[metric].iloc[0] if len(metrics_over_time) > 1 else 0
            for metric in ['tasks_completed', 'email_sent_count', 'meeting_duration', 'efficiency_score']
        }
    }

# Detaylı Duygu Analizi
def detailed_sentiment_analysis(data):
    # NLTK'nin vader lexicon'unu indir
    nltk.download('vader_lexicon')
    sia = SentimentIntensityAnalyzer()
    
    if isinstance(data, str):
        data = [data]
    
    sentiment_scores = []
    for text in data:
        # VADER sentiment analizi
        vader_scores = sia.polarity_scores(text)
        
        # Metin özellikleri
        word_count = len(text.split())
        
        sentiment_scores.append({
            'vader_scores': vader_scores,
            'word_count': word_count,
            'overall_sentiment': 'positive' if vader_scores['compound'] > 0.05 
                               else 'negative' if vader_scores['compound'] < -0.05 
                               else 'neutral'
        })
    
    return {
        'individual_scores': sentiment_scores,
        'average_sentiment': {
            'compound': np.mean([score['vader_scores']['compound'] for score in sentiment_scores]),
            'positive': np.mean([score['vader_scores']['pos'] for score in sentiment_scores]),
            'negative': np.mean([score['vader_scores']['neg'] for score in sentiment_scores]),
            'neutral': np.mean([score['vader_scores']['neu'] for score in sentiment_scores])
        }
    }

# Öngörücü Analitik
def predictive_analytics(historical_data, forecast_periods=30):
    df = pd.DataFrame(historical_data)
    
    # Tarihleri oluştur (1 Ocak 2024'ten başlayarak)
    start_date = pd.Timestamp('2024-01-01')
    df['ds'] = df['day'].apply(lambda x: start_date + pd.Timedelta(days=x))
    
    predictions = {}
    for metric in ['tasks_completed', 'email_sent_count', 'meeting_duration', 'focus_hours']:
        # Prophet için veri hazırlama
        prophet_df = df[['ds', metric]].rename(columns={metric: 'y'})
         
        # Prophet modelini oluştur ve eğit
        model = Prophet(yearly_seasonality=False, weekly_seasonality=True)
        model.fit(prophet_df)
        
        # Gelecek tahminleri
        future_dates = model.make_future_dataframe(periods=forecast_periods)
        forecast = model.predict(future_dates)
        
        predictions[metric] = {
            'forecast': forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(forecast_periods).to_dict(),
            'components': model.plot_components(forecast)
        }
    
    return predictions

# Çalışan Segmentasyonu
def analyze_employee_segments(employee_data_list):
    """
    Segments employees based on performance characteristics and analyzes each segment.
    
    Returns:
        dict: Segmentation results including segment characteristics and recommendations
    """
    try:
        # Veriyi hazırla
        features = []
        for data in employee_data_list:
            metrics = calculate_performance_metrics(data)
            feature_vector = [
                metrics['task_completion_rate'],
                metrics['email_efficiency'],
                metrics['meeting_efficiency'],
                metrics['collaboration_score']
            ]
            features.append(feature_vector)
        
        # Veriyi normalize et
        scaler = StandardScaler()
        features_normalized = scaler.fit_transform(features)
        
        # Optimal küme sayısını bul
        max_clusters = min(len(features), 5)  # En fazla 5 küme
        best_score = -1
        best_n_clusters = 2
        
        for n_clusters in range(2, max_clusters + 1):
            kmeans = KMeans(n_clusters=n_clusters, random_state=42)
            cluster_labels = kmeans.fit_predict(features_normalized)
            score = silhouette_score(features_normalized, cluster_labels)
            
            if score > best_score:
                best_score = score
                best_n_clusters = n_clusters
        
        # Final kümeleme
        kmeans = KMeans(n_clusters=best_n_clusters, random_state=42)
        cluster_labels = kmeans.fit_predict(features_normalized)
        
        # Küme merkezlerini orijinal ölçeğe geri dönüştür
        cluster_centers_original = scaler.inverse_transform(kmeans.cluster_centers_)
        
        # PCA ile 2 boyuta indir (görselleştirme için)
        pca = PCA(n_components=2)
        features_2d = pca.fit_transform(features_normalized)
        
        # Aykırı değer tespiti
        isolation_forest = IsolationForest(random_state=42)
        outliers = isolation_forest.fit_predict(features_normalized)
        
        # Sonuçları hazırla
        segments = {}
        for i in range(best_n_clusters):
            segment_indices = [j for j, label in enumerate(cluster_labels) if label == i]
            segment_size = len(segment_indices)
            
            segment_info = {
                'size': segment_size,
                'percentage': segment_size / len(features) * 100,
                'avg_metrics': {
                    'task_completion': cluster_centers_original[i][0],
                    'email_efficiency': cluster_centers_original[i][1],
                    'meeting_efficiency': cluster_centers_original[i][2],
                    'collaboration': cluster_centers_original[i][3]
                },
                'members': segment_indices,
                'characteristics': []
            }
            
            # Segmentin karakteristik özelliklerini belirle
            metrics = segment_info['avg_metrics']
            if metrics['task_completion'] > 0.7:
                segment_info['characteristics'].append('High task completion')
            elif metrics['task_completion'] < 0.4:
                segment_info['characteristics'].append('Low task completion')
                
            if metrics['email_efficiency'] > 0.7:
                segment_info['characteristics'].append('Fast email response')
            elif metrics['email_efficiency'] < 0.4:
                segment_info['characteristics'].append('Slow email response')
                
            if metrics['meeting_efficiency'] > 0.7:
                segment_info['characteristics'].append('Effective meeting participation')
            elif metrics['meeting_efficiency'] < 0.4:
                segment_info['characteristics'].append('Low meeting effectiveness')
                
            if metrics['collaboration'] > 0.7:
                segment_info['characteristics'].append('Strong collaboration')
            elif metrics['collaboration'] < 0.4:
                segment_info['characteristics'].append('Weak collaboration')
            
            segments[f'Segment_{i+1}'] = segment_info
        
        # Aykırı değerleri ekle
        outlier_indices = [i for i, pred in enumerate(outliers) if pred == -1]
        
        return {
            'n_segments': best_n_clusters,
            'silhouette_score': best_score,
            'segments': segments,
            'outliers': outlier_indices,
            'visualization_data': {
                'features_2d': features_2d.tolist(),
                'cluster_labels': cluster_labels.tolist()
            }
        }
        
    except Exception as e:
        print(f"Error during segmentation analysis: {str(e)}")
        return None

# Tüm çalışanları analiz etme fonksiyonu
def analyze_all_employees():
    """Tüm çalışanların verilerini analiz eder"""
    try:
        print("Starting analyze_all_employees...")
        
        # Supabase bağlantısı yoksa örnek veri kullan
        if supabase is None:
            print("Using dummy data because Supabase connection is not available")
            # Dummy veri oluştur
            return generate_dummy_employee_analysis()
        
        # Tüm çalışanları al
        response = supabase.table('employees').select('*').execute()
        employees = response.data if response else []
        
        print(f"Found {len(employees)} employees")
        
        if not employees:
            print("No employees found")
            return {
                "total_employees": 0,
                "department_statistics": {},
                "team_statistics": {}
            }

        department_stats = {}
        team_stats = {}
        total_employees = len(employees)

        for employee in employees:
            try:
                print(f"Processing employee {employee.get('id', 'unknown')}")
                
                # Çalışan verilerini al
                emp_data_response = supabase.table('employee_data').select('*').eq('employee_id', employee['id']).execute()
                employee_data = emp_data_response.data if emp_data_response else []

                if not employee_data:
                    print(f"No data found for employee {employee.get('id', 'unknown')}")
                    continue

                # Performans metriklerini hesapla
                metrics = calculate_performance_metrics(employee_data[-1])

                # Departman istatistiklerini güncelle
                dept = employee.get('department', 'Unknown')
                if dept not in department_stats:
                    department_stats[dept] = {
                        'performance': 0,
                        'completion_rate': 0,
                        'total_employees': 0
                    }
                
                department_stats[dept]['total_employees'] += 1
                department_stats[dept]['performance'] += metrics['task_completion_rate'] * 100
                department_stats[dept]['completion_rate'] += metrics['time_efficiency'] * 100

                # Takım istatistiklerini güncelle
                team = employee.get('team', 'Unknown')
                if team not in team_stats:
                    team_stats[team] = {
                        'performance': 0,
                        'completion_rate': 0,
                        'total_employees': 0
                    }
                
                team_stats[team]['total_employees'] += 1
                team_stats[team]['performance'] += metrics['task_completion_rate'] * 100
                team_stats[team]['completion_rate'] += metrics['time_efficiency'] * 100
                
            except Exception as emp_error:
                print(f"Error processing employee {employee.get('id', 'unknown')}: {str(emp_error)}")
                continue

        # Ortalamaları hesapla
        for dept in department_stats:
            total = department_stats[dept]['total_employees']
            if total > 0:
                department_stats[dept]['performance'] = round(department_stats[dept]['performance'] / total, 1)
                department_stats[dept]['completion_rate'] = round(department_stats[dept]['completion_rate'] / total, 1)

        for team in team_stats:
            total = team_stats[team]['total_employees']
            if total > 0:
                team_stats[team]['performance'] = round(team_stats[team]['performance'] / total, 1)
                team_stats[team]['completion_rate'] = round(team_stats[team]['completion_rate'] / total, 1)

        result = {
            "total_employees": total_employees,
            "department_statistics": department_stats,
            "team_statistics": team_stats
        }
        
        print("Analysis completed successfully")
        return result

    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        return {
            "total_employees": 0,
            "department_statistics": {},
            "team_statistics": {}
        }

# Dummy veri örneği oluşturma
def generate_dummy_employee_analysis():
    """Gerçek veritabanı bağlantısı yokken demo görüntülemek için örnek veri oluşturur"""
    print("Generating dummy employee analysis data")
    
    # Örnek departmanlar
    departments = ["Yazılım", "Pazarlama", "İnsan Kaynakları", "Finans"]
    
    # Örnek takımlar
    teams = ["Frontend", "Backend", "DevOps", "Dijital Pazarlama", "İçerik", "İK Operasyon", "İK İşe Alım"]
    
    department_statistics = {}
    team_statistics = {}
    
    # Departman istatistikleri
    for dept in departments:
        department_statistics[dept] = {
            "average_performance": round(np.random.uniform(60, 95), 2),
            "completion_rate": round(np.random.uniform(70, 98), 2),
            "training_hours": round(np.random.uniform(10, 50), 1),
            "skill_growth": round(np.random.uniform(5, 20), 2),
            "engagement_score": round(np.random.uniform(3, 5), 1)
        }
    
    # Takım istatistikleri
    for team in teams:
        team_statistics[team] = {
            "average_performance": round(np.random.uniform(60, 95), 2),
            "completion_rate": round(np.random.uniform(70, 98), 2),
            "training_hours": round(np.random.uniform(10, 50), 1),
            "skill_growth": round(np.random.uniform(5, 20), 2),
            "engagement_score": round(np.random.uniform(3, 5), 1)
        }
    
    return {
        "total_employees": 32,  # Örnek çalışan sayısı
        "department_statistics": department_statistics,
        "team_statistics": team_statistics
    }

# Departman raporu oluşturma
def generate_department_report_pdf(department_name, department_stats, employee_analyses, output_file):
    """Departman bazlı PDF raporu oluşturur"""
    pdf = FPDF()
    pdf.add_page()
    
    # Font ayarları - DejaVu Sans kullan (Unicode desteği için)
    pdf.add_font('DejaVu', '', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', uni=True)
    pdf.set_font('DejaVu', '', 12)
    
    # Başlık
    pdf.set_font('DejaVu', '', 16)
    pdf.cell(0, 10, f"{department_name} Department Performance Report", ln=True, align='C')
    
    # Departman özeti
    pdf.set_font('DejaVu', '', 12)
    pdf.cell(0, 10, f"Total Employees: {department_stats['total_employees']}", ln=True)
    pdf.cell(0, 10, f"Average Task Completion: %{department_stats['avg_task_completion']*100:.1f}", ln=True)
    pdf.cell(0, 10, f"Average Email Response Efficiency: %{department_stats['avg_email_response']*100:.1f}", ln=True)
    
    # Çalışan detayları
    pdf.ln(10)
    pdf.set_font('DejaVu', '', 14)
    pdf.cell(0, 10, "Employee Details", ln=True)
    
    for emp_id, analysis in employee_analyses.items():
        # Yeni sayfa kontrolü
        if pdf.get_y() > 250:
            pdf.add_page()
        
        pdf.set_font('DejaVu', '', 12)
        pdf.cell(0, 10, f"Employee ID: {emp_id}", ln=True)
        
        pdf.set_font('DejaVu', '', 10)
        metrics = analysis["metrics"]
        pdf.cell(0, 8, f"Task Completion: %{metrics['task_completion_rate']*100:.1f}", ln=True)
        pdf.cell(0, 8, f"Email Efficiency: %{metrics['email_efficiency']*100:.1f}", ln=True)
        pdf.cell(0, 8, f"Meeting Efficiency: %{metrics['meeting_efficiency']*100:.1f}", ln=True)
        pdf.cell(0, 8, f"Collaboration Score: %{metrics['collaboration_score']*100:.1f}", ln=True)
        
        # Öneriler
        if analysis["recommendations"]:
            pdf.ln(5)
            pdf.set_font('DejaVu', '', 10)
            pdf.cell(0, 8, "Recommended Training:", ln=True)
            for rec in analysis["recommendations"][:2]:  # İlk 2 öneriyi göster
                pdf.cell(0, 8, f"• {rec['suggestion']}", ln=True)
        pdf.ln(10)
    
    pdf.output(output_file)

# Takım raporu oluşturma
def generate_team_report_pdf(team_name, team_stats, employee_analyses, output_file):
    """Takım bazlı PDF raporu oluşturur"""
    pdf = FPDF()
    pdf.add_page()
    
    # Font ayarları - DejaVu Sans kullan (Unicode desteği için)
    pdf.add_font('DejaVu', '', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', uni=True)
    pdf.set_font('DejaVu', '', 12)
    
    # Başlık
    pdf.set_font('DejaVu', '', 16)
    pdf.cell(0, 10, f"{team_name} Team Performance Report", ln=True, align='C')
    
    # Takım özeti
    pdf.set_font('DejaVu', '', 12)
    pdf.cell(0, 10, f"Total Employees: {team_stats['total_employees']}", ln=True)
    pdf.cell(0, 10, f"Average Task Completion: %{team_stats['avg_task_completion']*100:.1f}", ln=True)
    pdf.cell(0, 10, f"Average Email Response Efficiency: %{team_stats['avg_email_response']*100:.1f}", ln=True)
    
    # Performans Dağılımı
    pdf.ln(10)
    pdf.set_font('DejaVu', '', 14)
    pdf.cell(0, 10, "Team Performance Distribution", ln=True)
    
    metrics = {
        'task_completion': [],
        'email_efficiency': [],
        'meeting_efficiency': [],
        'collaboration': []
    }
    
    for analysis in employee_analyses.values():
        m = analysis["metrics"]
        metrics['task_completion'].append(m['task_completion_rate'])
        metrics['email_efficiency'].append(m['email_efficiency'])
        metrics['meeting_efficiency'].append(m['meeting_efficiency'])
        metrics['collaboration'].append(m['collaboration_score'])
    
    pdf.set_font('DejaVu', '', 10)
    for metric, values in metrics.items():
        if values:
            avg = sum(values) / len(values)
            max_val = max(values)
            min_val = min(values)
            pdf.cell(0, 8, f"{metric.replace('_', ' ').title()}:")
            pdf.ln(5)
            pdf.cell(0, 8, f"Average: %{avg*100:.1f}")
            pdf.ln(5)
            pdf.cell(0, 8, f"Highest: %{max_val*100:.1f}")
            pdf.ln(5)
            pdf.cell(0, 8, f"Lowest: %{min_val*100:.1f}")
            pdf.ln(10)
    
    # Takım Önerileri
    pdf.ln(10)
    pdf.set_font('DejaVu', '', 14)
    pdf.cell(0, 10, "Team Development Recommendations", ln=True)
    
    # En sık karşılaşılan önerileri topla
    all_recommendations = []
    for analysis in employee_analyses.values():
        all_recommendations.extend([rec['area'] for rec in analysis['recommendations']])
    
    if all_recommendations:
        from collections import Counter
        top_recommendations = Counter(all_recommendations).most_common(3)
        
        pdf.set_font('DejaVu', '', 10)
        for area, count in top_recommendations:
            pdf.cell(0, 8, f"• {area}: recommended for {count} employees")
            pdf.ln(5)
    
    pdf.output(output_file)

# Tüm raporları oluşturma
def generate_all_reports():
    """Tüm departman ve takım raporlarını oluşturur"""
    try:
        print("Starting generate_all_reports...")
        
        # Raporlar klasörünü oluştur
        if not os.path.exists("reports"):
            os.makedirs("reports")
            print("Created reports directory")
            
        # Raporlar klasörünü temizle
        for file in os.listdir("reports"):
            if file.endswith(".pdf"):
                os.remove(os.path.join("reports", file))
                
        print("Cleaned reports directory")
        
        # Supabase bağlantısı yoksa örnek veri kullan
        if supabase is None:
            print("Using dummy data because Supabase connection is not available")
            # Dummy rapor dosyası oluştur
            dummy_report_path = os.path.join("reports", "dummy_report.pdf")
            pdf = FPDF()
            pdf.add_page()
            pdf.set_font("Arial", size=12)
            pdf.cell(200, 10, txt="Dummy Report - No Supabase Connection", ln=True, align='C')
            pdf.cell(200, 10, txt="This is a placeholder report.", ln=True)
            pdf.output(dummy_report_path)
            
            return ["dummy_report.pdf"]
        
        # Supabase'den verileri çek
        emp_response = supabase.table('employees').select('*').execute()
        data_response = supabase.table('employee_data').select('*').execute()
        
        if not emp_response.data or not data_response.data:
            print("No data found!")
            return
            
        employees = emp_response.data
        all_data = data_response.data
        
        # Departman ve takım bazlı veriler
        department_data = {}
        team_data = {}
        
        for emp in employees:
            emp_id = emp['id']
            dept = emp['department']
            team = emp['team']
            
            # Çalışanın verilerini filtrele
            emp_data = [d for d in all_data if d['employee_id'] == emp_id]
            
            if not emp_data:
                continue
                
            # Analiz yap
            latest_data = emp_data[-1]
            metrics = calculate_performance_metrics(latest_data)
            trends = analyze_trends(emp_data)
            recommendations = generate_recommendations(metrics, trends)
            
            analysis = {
                "metrics": metrics,
                "trends": trends,
                "recommendations": recommendations
            }
            
            # Departman verilerini grupla
            if dept not in department_data:
                department_data[dept] = {
                    "stats": {"total_employees": 0, "avg_task_completion": 0, "avg_email_response": 0},
                    "analyses": {}
                }
            department_data[dept]["stats"]["total_employees"] += 1
            department_data[dept]["stats"]["avg_task_completion"] += metrics["task_completion_rate"]
            department_data[dept]["stats"]["avg_email_response"] += metrics["email_efficiency"]
            department_data[dept]["analyses"][emp_id] = analysis
            
            # Takım verilerini grupla
            if team not in team_data:
                team_data[team] = {
                    "stats": {"total_employees": 0, "avg_task_completion": 0, "avg_email_response": 0},
                    "analyses": {}
                }
            team_data[team]["stats"]["total_employees"] += 1
            team_data[team]["stats"]["avg_task_completion"] += metrics["task_completion_rate"]
            team_data[team]["stats"]["avg_email_response"] += metrics["email_efficiency"]
            team_data[team]["analyses"][emp_id] = analysis
        
        # Ortalamaları hesapla
        for dept_info in department_data.values():
            total = dept_info["stats"]["total_employees"]
            if total > 0:
                dept_info["stats"]["avg_task_completion"] /= total
                dept_info["stats"]["avg_email_response"] /= total
        
        for team_info in team_data.values():
            total = team_info["stats"]["total_employees"]
            if total > 0:
                team_info["stats"]["avg_task_completion"] /= total
                team_info["stats"]["avg_email_response"] /= total
        
        # PDF raporları oluştur
        os.makedirs("reports", exist_ok=True)
        
        # Departman raporları
        for dept, info in department_data.items():
            output_file = f"reports/{dept.lower().replace(' ', '_')}_report.pdf"
            generate_department_report_pdf(dept, info["stats"], info["analyses"], output_file)
            print(f"{dept} department report generated: {output_file}")
        
        # Takım raporları
        for team, info in team_data.items():
            output_file = f"reports/{team.lower().replace(' ', '_')}_report.pdf"
            generate_team_report_pdf(team, info["stats"], info["analyses"], output_file)
            print(f"{team} team report generated: {output_file}")
        
        print("\nAll reports generated successfully!")
        
    except Exception as e:
        print(f"Error during report generation: {str(e)}")

def generate_individual_report_pdf(employee_id, metrics, trends, recommendations, output_file):
    """Çalışan bazlı detaylı PDF raporu oluşturur"""
    pdf = FPDF()
    pdf.add_page()
    
    # Font ayarları - DejaVu Sans kullan (Unicode desteği için)
    pdf.add_font('DejaVu', '', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', uni=True)
    pdf.set_font('DejaVu', '', 12)
    
    # Başlık
    pdf.set_font('DejaVu', '', 16)
    pdf.cell(0, 10, f"Employee Performance Report (ID: {employee_id})", ln=True, align='C')
    
    # Performans Metrikleri
    pdf.set_font('DejaVu', '', 14)
    pdf.cell(0, 10, "Performance Metrics", ln=True)
    
    pdf.set_font('DejaVu', '', 12)
    pdf.cell(0, 10, f"Task Completion Rate: %{metrics['task_completion_rate']*100:.1f}", ln=True)
    pdf.cell(0, 10, f"Email Efficiency: %{metrics['email_efficiency']*100:.1f}", ln=True)
    pdf.cell(0, 10, f"Meeting Efficiency: %{metrics['meeting_efficiency']*100:.1f}", ln=True)
    pdf.cell(0, 10, f"Collaboration Score: %{metrics['collaboration_score']*100:.1f}", ln=True)
    
    # Trend Analizi
    pdf.ln(10)
    pdf.set_font('DejaVu', '', 14)
    pdf.cell(0, 10, "Trend Analysis", ln=True)
    
    pdf.set_font('DejaVu', '', 12)
    for metric, trend in trends.items():
        pdf.cell(0, 10, f"{metric}: {trend['direction']} (%{trend['change_rate']*100:.1f})", ln=True)
        pdf.cell(0, 10, f"Forecast: {trend['forecast']}", ln=True)
        pdf.ln(5)
    
    # Gelişim Önerileri
    pdf.ln(10)
    pdf.set_font('DejaVu', '', 14)
    pdf.cell(0, 10, "Development Recommendations", ln=True)
    
    pdf.set_font('DejaVu', '', 12)
    for rec in recommendations:
        pdf.cell(0, 10, f"• Area: {rec['area']}", ln=True)
        pdf.cell(0, 10, f"  Suggestion: {rec['suggestion']}", ln=True)
        if 'expected_impact' in rec:
            pdf.cell(0, 10, f"  Expected Impact: {rec['expected_impact']}", ln=True)
        pdf.ln(5)
    
    pdf.output(output_file)

# Çalışan Detaylı Analizi
def analyze_individual_employee(employee_id):
    """Belirli bir çalışanın detaylı analizini yapar"""
    try:
        print(f"Analyzing employee with ID: {employee_id}")
        
        # Supabase bağlantısı yoksa örnek veri kullan
        if supabase is None:
            print("Using dummy data because Supabase connection is not available")
            # Dummy çalışan analizi oluştur
            return generate_dummy_individual_analysis(employee_id)
        
        # Supabase'den çalışan verilerini çek
        response = supabase.table('employee_data').select('*').eq('employee_id', employee_id).execute()
        
        if not response.data:
            return {"error": "Employee not found"}
            
        employee_data = response.data
        latest_data = employee_data[-1]
        
        # Temel metrikleri hesapla
        metrics = calculate_performance_metrics(latest_data)
        
        # Trend analizi yap
        trends = analyze_trends(employee_data)
        
        # Öneriler oluştur
        recommendations = generate_recommendations(metrics, trends)
        
        # Segmentasyon analizi
        segment_info = None
        if len(employee_data) >= 2:  # En az 2 veri noktası gerekli
            segment_results = analyze_employee_segments(employee_data)
            if segment_results:
                # Çalışanın hangi segmentte olduğunu bul
                for segment_name, segment in segment_results['segments'].items():
                    if employee_data.index(latest_data) in segment['members']:
                        segment_info = {
                            'segment_name': segment_name,
                            'segment_characteristics': segment['characteristics'],
                            'segment_size': segment['size'],
                            'segment_percentage': segment['percentage']
                        }
                        break
        
        # Detaylı analiz sonuçlarını hazırla
        analysis_results = {
            'employee_id': employee_id,
            'current_metrics': metrics,
            'historical_trends': trends,
            'recommendations': recommendations,
            'segment_info': segment_info,
            'last_updated': latest_data.get('timestamp', None),
            'performance_summary': {
                'overall_score': sum([
                    metrics['task_completion_rate'],
                    metrics['email_efficiency'],
                    metrics['meeting_efficiency'],
                    metrics['collaboration_score']
                ]) / 4,
                'strongest_area': max(metrics.items(), key=lambda x: x[1])[0],
                'improvement_needed': min(metrics.items(), key=lambda x: x[1])[0]
            }
        }
        
        # PDF raporu oluştur
        os.makedirs("reports", exist_ok=True)
        report_file = f"reports/employee_{employee_id}_report.pdf"
        generate_individual_report_pdf(
            employee_id,
            metrics,
            trends,
            recommendations,
            report_file
        )
        
        analysis_results['report_file'] = report_file
        
        return analysis_results
        
    except Exception as e:
        print(f"Error during employee analysis: {str(e)}")
        return {"error": str(e)}

# Dummy bireysel çalışan analizi 
def generate_dummy_individual_analysis(employee_id):
    """Demo amaçlı dummy bireysel çalışan analizi oluşturur"""
    print(f"Generating dummy analysis for employee ID: {employee_id}")
    
    # Örnek metrikler
    current_metrics = {
        "task_completion_rate": round(np.random.uniform(70, 98), 2),
        "quality_score": round(np.random.uniform(60, 95), 2),
        "engagement_level": round(np.random.uniform(3, 5), 1),
        "training_hours": round(np.random.uniform(10, 50), 1),
        "productivity_index": round(np.random.uniform(75, 98), 2),
        "skill_growth": round(np.random.uniform(5, 20), 2)
    }
    
    # Örnek trendler
    historical_trends = {
        "monthly": {
            "task_completion": [round(np.random.uniform(65, 95), 2) for _ in range(6)],
            "quality_score": [round(np.random.uniform(55, 90), 2) for _ in range(6)],
            "productivity": [round(np.random.uniform(70, 95), 2) for _ in range(6)]
        },
        "quarterly": {
            "engagement": [round(np.random.uniform(3, 5), 1) for _ in range(4)],
            "skill_growth": [round(np.random.uniform(3, 18), 2) for _ in range(4)]
        }
    }
    
    # Örnek öneriler
    recommendations = [
        {
            "title": "Veri Bilimi Temel Eğitimi",
            "description": "Python ve veri analizi konusunda yeteneklerinizi geliştirin",
            "priority": "Yüksek",
            "resource": "Microsoft Learn - Data Science Fundamentals"
        },
        {
            "title": "Proje Yönetimi Metodolojileri",
            "description": "Agile ve Scrum konularında bilgilerinizi pekiştirin",
            "priority": "Orta",
            "resource": "Project Management Institute - Agile Practices"
        },
        {
            "title": "İleri Seviye İletişim Becerileri",
            "description": "Ekip içi iletişim ve sunum becerilerinizi geliştirin",
            "priority": "Düşük",
            "resource": "LinkedIn Learning - Communication Skills"
        }
    ]
    
    # Örnek rapor
    report_file = "dummy_employee_report.pdf"
    
    # Raporlar klasörünü oluştur
    if not os.path.exists("reports"):
        os.makedirs("reports")
    
    # Dummy PDF oluştur
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"Dummy Employee Report for ID: {employee_id}", ln=True, align='C')
    pdf.cell(200, 10, txt="This is a placeholder report.", ln=True)
    pdf.output(os.path.join("reports", report_file))
    
    return {
        "employee_id": employee_id,
        "current_metrics": current_metrics,
        "historical_trends": historical_trends,
        "recommendations": recommendations,
        "segment_info": {
            "segment": "High-Performers",
            "characteristics": "Consistent quality and high engagement"
        },
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "performance_summary": {
            "overall_rating": "Excellent",
            "strengths": ["Task completion", "Quality of work"],
            "areas_for_improvement": ["Technical skills", "Team collaboration"]
        },
        "report_file": report_file
    }

if __name__ == "__main__":
    generate_all_reports()