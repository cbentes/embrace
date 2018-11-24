/*****************************************************
 *                  Junction 2018
 * 
 * Project: Embrace
*****************************************************/

using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using UnityEngine;


public class GameState
{
    public string command;
    public string animal;
    public int exposure;
}


public class BallFearController : MonoBehaviour {

    private Renderer _renderer;
    private GameState state_map;

    private string ball_state = "still";
    private string _url = "http://18.203.88.206/exchange_data";

    private float MIN_Z_DISTANCE = -4.0f;
    private float MAX_Z_DISTANCE = 20.0f;

    void Start () {
        _renderer = gameObject.GetComponent<Renderer>();
        InvokeRepeating("UpdateBallState", 0.6f, 0.6f);
    }

    IEnumerator UpdateBallState(){
        Vector3 c = Camera.current.transform.position;
        string param = "?x="+ c.x + "&y=" + c.y + "&z=" + c.z;
        string q = _url + param;
        using (WWW www = new WWW(q))
        {
            yield return www;
            if (string.IsNullOrEmpty(www.error)){
                ball_state = www.text;
                Debug.Log(">>>> DATA: " + ball_state);
                state_map = JsonUtility.FromJson<GameState>(ball_state);
            }
        }
    }

    void Update () {

        // Called when update frames
        Vector3 spherePosition = _renderer.transform.position;
        Debug.Log(">>> Exposure: " + state_map.exposure);

        // Change position
        /**
        switch (ball_state)
        {
            case "closer":
                spherePosition.z -= 0.1f;
                break;
            case "further":
                spherePosition.z += 0.1f;
                break;
            case "still":
                break;
            default:
                break;
        }
        **/

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
