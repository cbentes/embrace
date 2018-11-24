/*****************************************************
 *                  Junction 2018
 * 
 * Project: Embrace
*****************************************************/

using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using UnityEngine;


public class RoomFearController : MonoBehaviour {

    private Renderer _renderer;
    private GameState state_map;

    // private string _url = "http://18.203.88.206/exchange_data";
    private string _url = "http://127.0.0.1:5000/exchange_data";
    private float MIN_Z_DISTANCE = 0.0f;
    private float MAX_Z_DISTANCE = 20.0f;

    void Start () {
        _renderer = gameObject.GetComponent<Renderer>();
        InvokeRepeating("UpdateRoomState", 0.6f, 0.6f);
    }

    IEnumerator UpdateRoomState()
    {
        Vector3 c = Camera.current.transform.position;
        string param = "?x=" + c.x + "&y=" + c.y + "&z=" + c.z;
        string q = _url + param;
        using (WWW www = new WWW(q))
        {
            yield return www;
            if (string.IsNullOrEmpty(www.error))
            {
                // Debug.Log(">>>> DATA: " + ball_state);
                state_map = JsonUtility.FromJson<GameState>(www.text);
            }
        }
    }

    // Update is called once per frame
    void Update () {
        // Called when update frames
        Vector3 spherePosition = _renderer.transform.position;
        // Debug.Log(">>> Exposure: " + state_map.exposure);

        float exposure = (float)state_map.exposure;
        float range = (MAX_Z_DISTANCE - MIN_Z_DISTANCE) * exposure / 100.0f;
        spherePosition.z = range + MIN_Z_DISTANCE;

        // Limit max distance
        if (spherePosition.z > MAX_Z_DISTANCE)
            spherePosition.z = MAX_Z_DISTANCE;
        // Limit min distance
        if (spherePosition.z < MIN_Z_DISTANCE)
            spherePosition.z = MIN_Z_DISTANCE;

        // Transform position 
        _renderer.transform.position = spherePosition;
    }
}
