package com.movesense.samples.dataloggersample;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.microsoft.azure.sdk.iot.device.DeviceClient;
import com.microsoft.azure.sdk.iot.device.IotHubClientProtocol;
import com.microsoft.azure.sdk.iot.device.IotHubEventCallback;
import com.microsoft.azure.sdk.iot.device.IotHubStatusCode;
import com.microsoft.azure.sdk.iot.device.Message;
import com.movesense.mds.MdsException;
import com.movesense.mds.MdsNotificationListener;
import com.movesense.mds.MdsSubscription;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;

import static com.movesense.mds.Mds.URI_EVENTLISTENER;
import static com.movesense.samples.dataloggersample.MainActivity.mMds;

public class DataLoggerActivity extends AppCompatActivity {
    public static DataLoggerActivity s_INSTANCE;

    // IOT Hub
    private final String connString = "HostName=junction.azure-devices.net;DeviceId=test-emulator;SharedAccessKey=gTGC+0C9vFwDGRknqLltI/MfnZglcceB82Uv02maU30=";
    private final String deviceId = "MyAndroidDevice";
    private DeviceClient client;
    IotHubClientProtocol protocol = IotHubClientProtocol.MQTT;
    private static String publicKeyCertificateString = "";
    //PEM encoded representation of the private key
    private static String privateKeyString = "";
    private static final int METHOD_SUCCESS = 200;
    private static final int METHOD_NOT_DEFINED = 404;

    private static final String LOG_TAG = DataLoggerActivity.class.getSimpleName();

    public static final String SERIAL = "serial";
    String connectedSerial;

    private DataLoggerState mDLState;
    private TextView mDataLoggerStateTextView;

    private static ArrayList<MdsLogbookEntriesResponse.LogEntry> mLogEntriesArrayList = new ArrayList<>();
    ArrayAdapter<MdsLogbookEntriesResponse.LogEntry> itemsAdapter;

    public static final String SCHEME_PREFIX = "suunto://";

    // Sensor subscription
    static private String URI_MEAS_HR = "/Meas/HR";
    static private String URI_MEAS_TEMP = "/Meas/Temp";
    private MdsSubscription heartRateSubscription;
    private MdsSubscription tempSubscription;
    private String subscribedDeviceSerial;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_datalogger);
        s_INSTANCE = this;

        // Find serial in opening intent
        Intent intent = getIntent();
        connectedSerial = intent.getStringExtra(SERIAL);

        try {
            initClient();
        } catch (Exception e) {
            Log.e(LOG_TAG, "Error initializing client", e);
        }
        subscribeToHeartRateSensor();
        subscribeToTemperatureSensor();
    }

    private void subscribeToTemperatureSensor() {
        // Clean up existing subscription (if there is one)
        if (tempSubscription != null) {
            unsubscribe();
        }

        StringBuilder sb = new StringBuilder();
        String strContract = sb.append("{\"Uri\": \"").append(connectedSerial).append(URI_MEAS_TEMP).append("\"}").toString();
        Log.d(LOG_TAG, strContract);

        subscribedDeviceSerial = connectedSerial;

        tempSubscription = mMds.builder().build(this).subscribe(URI_EVENTLISTENER,
                strContract, new MdsNotificationListener() {
                    @Override
                    public void onNotification(String data) {
                        Log.d(LOG_TAG, "onNotification(): " + data);
                        ((TextView) findViewById(R.id.temp_data)).setText(data);
                        try {
                            sendData(data);
                        } catch (Exception e) {
                            Log.e(LOG_TAG, "Error sending the msg", e);
                        }
                    }

                    @Override
                    public void onError(MdsException error) {
                        Log.e(LOG_TAG, "subscription onError(): ", error);
                        unsubscribe();
                    }
                });

    }

    private void subscribeToHeartRateSensor() {
        // Clean up existing subscription (if there is one)
        if (heartRateSubscription != null) {
            unsubscribe();
        }

        StringBuilder sb = new StringBuilder();
        String strContract = sb.append("{\"Uri\": \"").append(connectedSerial).append(URI_MEAS_HR).append("\"}").toString();
        Log.d(LOG_TAG, strContract);

        subscribedDeviceSerial = connectedSerial;

        heartRateSubscription = mMds.builder().build(this).subscribe(URI_EVENTLISTENER,
                strContract, new MdsNotificationListener() {
                    @Override
                    public void onNotification(String data) {
                        Log.d(LOG_TAG, "onNotification(): " + data);
                        ((TextView) findViewById(R.id.sensor_data)).setText(data);
                        try {
                            sendData(data);
                        } catch (Exception e) {
                            Log.e(LOG_TAG, "Error sending the msg", e);
                        }
                    }

                    @Override
                    public void onError(MdsException error) {
                        Log.e(LOG_TAG, "subscription onError(): ", error);
                        unsubscribe();
                    }
                });

    }

    private void unsubscribe() {
        if (heartRateSubscription != null) {
            heartRateSubscription.unsubscribe();
            heartRateSubscription = null;
        }

        if (tempSubscription != null) {
            tempSubscription.unsubscribe();
            tempSubscription = null;
        }

        subscribedDeviceSerial = null;
    }

    @Override
    protected void onDestroy() {
        unsubscribe();
        try {
            client.closeNow();
            Log.i(LOG_TAG, "Closed IOT Hub client");
        } catch (IOException e) {
            Log.e(LOG_TAG, "Error closing client", e);
        }
        super.onDestroy();
    }

    private void initClient() throws URISyntaxException, IOException
    {
        client = new DeviceClient(connString, protocol);

        try
        {
            client.open();
            Log.i(LOG_TAG, "Opened IOT Hub client");
        }
        catch (Exception e2)
        {
            e2.printStackTrace();
            Log.e(LOG_TAG, "Exception while opening IoTHub connection", e2);
            client.closeNow();
        }
    }

    public void sendData(String data) throws URISyntaxException, IOException
    {

        String msgStr = "{\"deviceId\":\"" + deviceId + "\",\"data\":" + data + "}";
        try
        {
            Message msg = new Message(msgStr);
            msg.setMessageId(java.util.UUID.randomUUID().toString());
            Log.i(LOG_TAG, msgStr);
            EventCallback eventCallback = new EventCallback();
            client.sendEventAsync(msg, eventCallback, 1);
        }
        catch (Exception e)
        {
            Log.e(LOG_TAG, "Error sending message", e);
        }
    }

    static class EventCallback implements IotHubEventCallback
    {
        public void execute(IotHubStatusCode status, Object context)
        {
            Integer i = (Integer) context;
            System.out.println("IoT Hub responded to message " + i.toString()
                    + " with status " + status.name());
        }
    }


}
